import Image from "next/image";

export default function EventPage() {
  return (
    <section className="bg-gradient-to-r from-white via-sky-100 to-orange-50 pb-16, py-16">
      <div className="flex justify-center mb-8">
        <Image
          src="/images/intro-img.jpg"
          alt="Hình ảnh giới thiệu trung tâm thú cưng"
          width={1600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Giới thiệu</h2>
        <p className="text-gray-700 text-base mb-4">
          Chào mừng bạn đến với Pet House - nơi cung cấp những sản phẩm và dịch vụ tốt nhất cho thú cưng của bạn!
        </p>
        <p className="text-gray-700 text-base mb-4">
          Tại Pet House, chúng tôi cam kết mang đến cho bạn những sản phẩm chất lượng nhất với mức giá phải chăng. Đội ngũ nhân viên của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn trong việc chăm sóc thú cưng của mình.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-2">Dịch vụ chăm sóc thú cưng</h3>
          <p className="text-gray-600">
            Chúng tôi cung cấp dịch vụ chăm sóc thú cưng toàn diện, từ tắm rửa đến cắt tỉa lông.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold mb-2">Sản phẩm chất lượng</h3>
          <p className="text-gray-600">
            Tại Pet House, bạn sẽ tìm thấy những sản phẩm chất lượng nhất cho thú cưng của mình.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">Đội ngũ chuyên nghiệp</h3>
            <p className="text-gray-600">
                Đội ngũ nhân viên của chúng tôi là những người yêu thú cưng và có kinh nghiệm trong ngành.
            </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">Khuyến mãi hấp dẫn</h3>
            <p className="text-gray-600">
                Theo dõi chúng tôi để không bỏ lỡ những chương trình khuyến mãi và giảm giá hấp dẫn!
            </p>
        </div>
      </div>
    </section>
  );
}
