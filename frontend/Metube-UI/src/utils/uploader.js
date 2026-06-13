export const getUploader = (video) => {
  if (!video) return { 
    name: 'Unknown', 
    avatarUrl: null 
  };

  const userShapes = [
    video.userId,
    video.user,
    video.uploader,
    video.uploaderInfo,
    video.owner,
    video.creator,
  ];

  for (const u of userShapes) {
    if (!u) continue;
    const name = u.name || u.displayName || u.username || u.fullName || u.firstName || u.lastName || u.title;
    const avatarUrl = u.avatarUrl || u.avatar || u.image || u.photo || u.profileImage;
    if (name || avatarUrl) return {
        name: name || 'Unknown', 
        avatarUrl: avatarUrl || null 
    };
  }

  // top-level fallbacks
  const candidates = [
    video.channelName,
    video.uploaderName,
    video.uploader_name,
    video.uploaderFullName,
    video.ownerName,
    video.author,
    video.creatorName,
    video.owner,
  ];
  const name = candidates.find(Boolean) || null;

  const avatarCandidates = [
    video.channelAvatar,
    video.avatarUrl,
    video.avatar,
    video.uploaderAvatar,
    video.uploader?.avatarUrl,
    video.uploader?.avatar,
  ];
  const avatarUrl = avatarCandidates.find(Boolean) || null;

  return { name: name || 'Unknown', avatarUrl };
};
