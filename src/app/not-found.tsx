'use client';

import Link from 'next/link';

export default function notFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-blue-800 ">
          404
        </h1>
        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Trang không tồn tại
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="px-8 py-3 bg-blue-800  text-white font-semibold rounded-lg shadow-lg hover:shadow-xl duration-200"
          >
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg border border-gray-200 duration-200"
          >
            Quay lại
          </button>
        </div>

        {/* Additional Help */}
        <div className="pt-8 text-sm text-gray-500">
          <p>Bạn có thể thử:</p>
          <ul className="mt-2 space-y-1">
            <li>• Kiểm tra lại URL</li>
            <li>• Tìm kiếm nội dung bạn cần</li>
            <li>• Liên hệ với chúng tôi nếu bạn nghĩ đây là lỗi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
