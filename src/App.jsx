import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { videos } from "./lib/video_Data";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [videosList, setVideosList] = useState(videos);
  const [selectedVideo, setSelectedVideo] = useState({});
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const storedBookmarkedVideos = JSON.parse(
      localStorage.getItem("bookmarkedVideos")
    );
    if (storedBookmarkedVideos) {
      setVideosList(
        videos.map((video) => ({
          ...video,
          bookmarked: storedBookmarkedVideos.some(
            (bookmarkedVideo) => bookmarkedVideo.id === video.id
          ),
        }))
      );
    }
  }, []);

  const handleOpen = (video) => {
    setSelectedVideo(video);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const toggleBookmark = (videoId) => {
    const updatedVideosList = videosList.map((video) =>
      video.id === videoId ? { ...video, bookmarked: !video.bookmarked } : video
    );
    setVideosList(updatedVideosList);
    localStorage.setItem(
      "bookmarkedVideos",
      JSON.stringify(updatedVideosList.filter((video) => video.bookmarked))
    );
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredVideos =
    filter === "Bookmarked"
      ? videosList.filter((video) => video.bookmarked)
      : videosList;

  return (
    <div className="flex flex-col w-full justify-center items-center my-6 p-4 h-full gap-16">
      <h1 className="text-7xl tracking-widest font-bold">Video Library</h1>
      <select
        className="border border-gray-600 px-2 py-3 text-xl"
        value={filter}
        onChange={handleFilterChange}
      >
        <option value="All">All</option>
        <option value="Bookmarked">Bookmarked</option>
      </select>
      <div className="flex justify-between w-full px-[150px] gap-4 h-full p-4">
        <div className="flex flex-col gap-8 w-1/2">
          {filteredVideos.map((video, index) => (
            <div
              key={index}
              className="w-full flex justify-evenly md:w-[500px] border border-gray-600 p-4"
            >
              <div
                className="w-full md:w-[280px]  h-[179px]  cursor-pointer"
                onClick={() => handleOpen(video)}
              >
                <img
                  src={video.img}
                  className="w-[280px] h-full object-cover rounded-2xl"
                  alt={video.name}
                />
              </div>
              <div className="flex flex-col justify-between p-2">
                <h1
                  className="text-2xl font-bold cursor-pointer"
                  onClick={() => handleOpen(video)}
                >
                  {video.name}
                </h1>
                <p>
                  {video.bookmarked ? (
                    <FaBookmark
                      size={30}
                      onClick={() => toggleBookmark(video.id)}
                    />
                  ) : (
                    <FaRegBookmark
                      size={30}
                      onClick={() => toggleBookmark(video.id)}
                    />
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
        {isOpen && (
          <div className="flex flex-col w-1/2 items-center gap-4 justify-center self-start border-2">
            <ReactPlayer
              url={selectedVideo.src}
              controls={true}
              playing={true}
              width={600}
              height={600}
            />
            <button
              onClick={handleClose}
              className="border text-2xl px-4 py-2 bg-red-600 rounded-xl text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
