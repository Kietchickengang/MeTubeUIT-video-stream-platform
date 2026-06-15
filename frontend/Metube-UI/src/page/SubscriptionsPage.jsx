import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getSubscriptions, toggleSubscription } from '../service/userDataService.js';

const SubscriptionsPage = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    setSubscriptions(getSubscriptions(user));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-4">
        <h1 className="text-3xl font-bold mb-3">Kênh đăng ký</h1>
        <p className="text-md text-blue-300 leading-relaxed mb-4">Vui lòng đăng nhập để tiếp tục.</p>
        <a href="/login" className="inline-block rounded-lg bg-[#1c62b9] px-5 py-2.5 text-blue-100 no-underline">Đăng nhập</a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
      <h1 className="ml-2 text-3xl font-bold mb-3">Kênh đăng ký</h1>
      <p className="ml-2 text-md text-blue-200 leading-relaxed mb-6">
        Nội dung từ các kênh bạn đăng ký sẽ hiển thị ở đây.
      </p>

      {subscriptions.length === 0 ? (
        <div className="w-fit rounded-xl border-none bg-neutral-900 p-3 text-blue-100">
          Bạn chưa đăng ký kênh nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptions.map((channel) => (
            <div key={channel.channelName} className="rounded-3xl border border-[#272727] bg-[#111111] p-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#222222] flex-shrink-0">
                  {channel.channelAvatar ? (
                    <img src={channel.channelAvatar} alt={channel.channelName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white">?</div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{channel.channelName}</h2>
                  <p className="text-sm text-[#aaaaaa]">Kênh đã đăng ký</p>
                </div>
              </div>
              <button
                onClick={() => setSubscriptions(toggleSubscription(user, channel))}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Hủy đăng ký
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
