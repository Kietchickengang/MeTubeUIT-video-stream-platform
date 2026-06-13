import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard.jsx";

const api_port = 8000;
const hostPath = `http://localhost:${api_port}/metube/my-videos`;

const YourVideosPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      if (!user) {
        setVideos([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(hostPath, {
          credentials: "include",
        });

        const data = await response.json();

        // backend may return userId as string; ensure display components receive an object
        const mapped = Array.isArray(data)
          ? data.map((v) => ({
              ...v,
              userId:
                v.userId && typeof v.userId === "object"
                  ? v.userId
                  : { name: user?.name || "Unknown", avatarUrl: user?.avatarUrl || null },
            }))
          : [];

        setVideos(mapped);
      } 
      catch (err) {
        console.error("Không thể tải video của bạn:", err);
        setVideos([]);
      } 
      finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [user]);

  // DELETE VIDEO
  const handleDelete = async (videoId) => {
    const cnf_msg = "Are you sure that you want to delete?";
    const confirmDelete = window.confirm(cnf_msg);

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:${api_port}/metube/${videoId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      // remove khỏi state
      setVideos((prev) => prev.filter((video) => video.videoId !== videoId));
    } 
    catch (err) {
      console.error("Delete error:", err);
      alert("Delete error");
    }
  };

  // EDIT VIDEO
  const handleEdit = (videoId) => {
    navigate(`/video/${videoId}/edit`);
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-4">
        <h1 className="text-3xl font-bold mb-3">Video của bạn</h1>

        <p className="text-md text-[#c0c0c0] leading-relaxed mb-4">
          Vui lòng đăng nhập để xem những video bạn đã tải lên.
        </p>

        <a
          href="/login"
          className="inline-block rounded-lg bg-[#1c62b9] px-5 py-2.5 text-white no-underline"
        >
          Đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-4">
      <h1 className="ml-2 text-3xl font-bold mb-3">Video của bạn</h1>

      <p className="ml-2 text-md text-[#c0c0c0] leading-relaxed mb-6">
        Quản lý các video bạn đã tải lên và xem trạng thái xử lý ở đây.
      </p>

      {loading ? (
        <div className="rounded-3xl border-none bg-[#121212] p-6 text-[#c0c0c0]">
          Đang tải video...
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-3xl border-none bg-[#121212] p-6 text-[#c0c0c0]">
          Bạn chưa tải lên video nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.videoId}
              className="bg-neutral-800 rounded-2xl overflow-hidden border-none p-3 hover:bg-neutral-400"
            >
              <VideoCard video={video} />

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(video.videoId)}
                  className="flex-1 btn btn-warning hover:bg-[#3a3a3a] text-white rounded-xl transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(video.videoId)}
                  className="flex-1 btn btn-danger hover:bg-red-700 text-white rounded-xl transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourVideosPage;
