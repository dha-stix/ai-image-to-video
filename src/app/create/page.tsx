"use client";
import { useState } from "react";
import storage from "../firebase";
import Loader from "../(components)/Loader";
import Result from "../(components)/Result";
import {
	deleteObject,
	getDownloadURL,
	ref,
	StorageReference,
	uploadBytes,
} from "firebase/storage";

export default function CreatePage() {
	const [generatingVideo, setGeneratingVideo] = useState<boolean>(false);
	const [triggerId, setTriggerId] = useState<string | null>(null);
	const [videoLink, setVideoLink] = useState<string | null>(null);

	if (videoLink && triggerId) {
		<Result link={videoLink} />;
	}

	return (
		<>
			{!videoLink && !generatingVideo && (
				<Form
					generatingVideo={generatingVideo}
					setGeneratingVideo={setGeneratingVideo}
					setTriggerId={setTriggerId}
					setVideoLink={setVideoLink}
					triggerId={triggerId}
				/>
			)}
			{videoLink && <Result link={videoLink} />}
			{generatingVideo && <Loader />}
		</>
	);
}

const Form = ({
	generatingVideo,
	setGeneratingVideo,
	setTriggerId,
	setVideoLink,
	triggerId,
}: {
	generatingVideo: boolean;
	setGeneratingVideo: React.Dispatch<React.SetStateAction<boolean>>;
	setTriggerId: React.Dispatch<React.SetStateAction<string | null>>;
	setVideoLink: React.Dispatch<React.SetStateAction<string | null>>;
	triggerId: string | null;
}) => {
	const [generatingImage, setGeneratingImage] = useState(false);
	const imageID = Math.random().toString(36).substring(2, 15);
	const imageRef = ref(storage, `images/${imageID}/image`);

	const executeWorkflow = async (image: string, effect: string) => {
		const response = await fetch("/api", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				image,
				effect,
			}),
		});
		const data = await response.json();

		if (!data.trigger_id) return alert("Error: No trigger id found");
		setTriggerId(data.trigger_id);
		setGeneratingImage(false);
		setGeneratingVideo(true);
		await new Promise((resolve) => setTimeout(resolve, 90_000));
		await fetchVideo(data.trigger_id);
	};

	const fetchVideo = async (trigger_id: string) => {
		if (!triggerId && !trigger_id) return;
		const response = await fetch(`/api?triggerId=${trigger_id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		deleteImage(imageRef);

		const data = await response.json();
		setVideoLink(data.url);
		setGeneratingVideo(false);
	};

	const deleteImage = (imageRef: StorageReference) => {
		if (!imageRef) return;
		deleteObject(imageRef)
			.then(() => {
				console.log("Image deleted successfully");
			})
			.catch((error) => {
				console.error("Error deleting image:", error);
			});
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setGeneratingImage(true);
		const formData = new FormData(event.currentTarget);
		const imageFile = formData.get("image") as File;
		const prompt = formData.get("prompt") as string;

		await uploadBytes(imageRef, imageFile).then(async () => {
			const imageURL = await getDownloadURL(imageRef);
			await executeWorkflow(imageURL, prompt);
		});
	};

	return (
		<div className='flex min-h-screen flex-col items-center justify-center p-4'>
			<h2 className='text-3xl font-bold mb-4'>Create Your Video</h2>

			<form className='w-2/3 mx-auto p-4' onSubmit={handleSubmit}>
				<label htmlFor='image' className='mb-2'>
					Upload an image:
				</label>
				<input
					type='file'
					id='image'
					name='image'
					accept='.png, .jpg, .jpeg'
					required
					className='w-full p-2 border border-gray-300 rounded mb-4'
				/>

				<label htmlFor='prompt' className='mb-2'>
					Enter a prompt:
				</label>
				<textarea
					id='prompt'
					name='prompt'
					required
					rows={5}
					className='w-full p-2 border border-gray-300 rounded mb-4'
					placeholder='Describe the video you want to create...'
				/>

				<button
					disabled={generatingImage || generatingVideo}
					type='submit'
					className='w-full bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-md'
				>
					{generatingImage ? "Processing..." : "Create Video"}
				</button>
			</form>
		</div>
	);
};