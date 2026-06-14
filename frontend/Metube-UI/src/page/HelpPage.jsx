const HelpPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-2">
      <h1 className="text-3xl font-semibold mb-4">Help & Features</h1>

      <p className="text-md text-gray-300 mb-6 leading-relaxed">
        This page lists the <span className="text-yellow-300">main features</span> available in this project. For details, check
        "<span className="text-red-400">More Details</span>" section.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-red-400">Core Features</h2>
        <ul className="list-disc pl-5 text-gray-200 space-y-2">
          <li>
            <span className="text-blue-500">Video upload and processing</span>: Client can upload raw video and choose thumbnail.
            We offer 3 options for thumbnail:
            <ul className="mt-3 mb-1 space-y-2.5 pl-4 border-none ml-1">
                <li className="flex items-center text-white">
                  <div className="w-1 h-1 rounded-full bg-zinc-600 mr-3"></div>
                  <span>Auto-generate</span>
                </li>
                <li className="flex items-center text-white">
                  <div className="w-1 h-1 rounded-full bg-zinc-600 mr-3"></div>
                  <span>Select an image file from your device</span>
                </li>
                <li className="flex items-center text-white">
                  <div className="w-1 h-1 rounded-full bg-zinc-600 mr-3"></div>
                  <span>Select 1 frame from raw video</span>
                </li>
              </ul>
          </li>
          <li>
            <span className="text-blue-500">Subscriptions</span>: Authenticated users can (un)subscribe from channels. Subscribers
            will receive real-time notifications when a subscribed channel publishes a new video.
          </li>
          <li>
            <span className="text-blue-500">Real-time notifications</span>: Navigation bar shows a bell icon with unread count and a dropdown 
            of notifications from subscribed channels.
          </li>
          <li>
            <span className="text-blue-500">Video playback</span>: Client can watch video with adjustable quality and adaptive renditions. 
            We support basic stream service like Youtube.
          </li>
          <li>
            <span className="text-blue-500">Searching</span>: We support searching videos by video's title and recommend top trending videos.
          </li>
          <li>
            <span className="text-blue-500">Updating profile</span>: Client can update profile information and change their avatar as much as he/she wants.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-red-400">Developer & Runtime Notes</h2>
        <ul className="list-disc pl-5 text-gray-200 space-y-2">
          <li className="flex items-start">
            <div className="leading-tight w-full">
              <li>
                <span className="text-blue-500">Architecture</span>: The infrastructure consists of three main components:
              </li>
              <ul className="mt-3 mb-1 space-y-2.5 pl-4 border-none ml-1">
                <li className="flex items-center text-zinc-400">
                  <div className="w-1 h-1 rounded-full bg-zinc-600 mr-3"></div>
                  <code className="text-sm font-mono bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded mr-2">api_server</code>
                  <span>(Express + MongoDB + Socket.IO)</span>
                </li>
                
                <li className="flex items-center text-zinc-400">
                  <div className="w-1 h-1 rounded-full bg-zinc-600 mr-3"></div>
                  <code className="text-sm font-mono bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded mr-2">worker_server</code>
                  <span>(FFmpeg + BullMQ + Redis)</span>
                </li>
                
                <li className="flex items-center text-zinc-400">
                  <div className="w-1 h-1 rounded-full bg-zinc-600 mr-3"></div>
                  <code className="text-sm font-mono bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded mr-2">frontend/Metube-UI</code>
                  <span>(React + TailwindCSS + Vite)</span>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <span className="text-blue-500">Storage</span>: Raw, processed video files and avatars are stored in an S3-compatible bucket. Make sure
            environment variables for S3 endpoint and buckets are configured for local or production usage.
          </li>
          <li>
            <span className="text-blue-500">Messaging</span>: The worker publishes a "ready" event to Redis. The API server subscribes to this
            event, creates Notification documents, and emits socket messages to user rooms.
          </li>
          <li>
            <span className="text-blue-500">Notification behaviour</span>: The uploader get a single "upload success" confirmation while subscribers
            receive a "new video" notification. Unread counts are cleared when the bell dropdown is opened.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-red-400">Troubleshooting</h2>
        <ul className="list-disc pl-5 text-gray-200 space-y-2">
          <li>Set up components as explained in documentation.</li>
          <li>Video's title should not contain special character such as "<span className="text-yellow-300">/ \ # % ?</span>".</li>
          <li>If socket notifications are not arriving, check Redis, reload the API server and socket connections.</li>
          <li>To avoid unexpected errors, you should use script{' '}
            <code className="border-none px-1 py-1 bg-neutral-900 rounded-lg text-green-400">
              run_project.sh
            </code> 
          {' '} to clean up and activate servers.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2 text-red-400">More Details</h2>
        <p className="text-gray-200">
          For complete developer instructions, setup or documentation, find more at: 
          <a href="https://github.com/Kietchickengang/MeTubeUIT-video-stream-platform/blob/main/README.md" 
            className="text-blue-600 no-underline ml-1"
            target="_blank" rel="noopener noreferrer"
            >Metube_docs</a>
        </p>
      </section>
    </div>
  );
};

export default HelpPage;
