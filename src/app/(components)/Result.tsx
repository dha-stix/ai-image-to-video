export default function Result({ link }: { link: string }) {
	return (
		<div className='flex flex-col w-full min-h-screen items-center justify-center'>
			<h2 className='text-2xl font-bold text-gray-500 mt-4 text-center'>
				Your video is ready!
			</h2>

			<section className='flex flex-col items-center space-y-5 mt-4'>
				<video
					className='rounded-lg shadow-lg'
					src={link}
					controls
					autoPlay
					loop
					muted
					style={{ width: "100%", maxWidth: "600px" }}
				/>
				<button
					className=' border-[1px] cursor-pointer p-4 rounded bg-blue-400 transition duration-200 mt-4'
					onClick={() => window.location.reload()}
				>
					Generate another video
				</button>
			</section>
		</div>
	);
}