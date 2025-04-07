import Image from "next/image";

const leftData = [
  {
    icon: "💰",
    title: "Cung Cấp Sản Phẩm Với Mức Giá Cả Phải Chăng",
    desc: "Ngoài các yếu tố về chất lượng sản phẩm cửa hàng uy tín...",
  },
  {
    icon: "👍",
    title: "Nhân Viên Tư Vấn Nhiệt Tình, Am Hiểu Về Thú Cưng",
    desc: "Bên cạnh các sản phẩm cung cấp đến khách hàng bạn có thể...",
  },
];

const rightData = [
  {
    icon: "❤️",
    title: "Cung Cấp Sản Phẩm Chất Lượng",
    desc: "Một trong những tiêu chí quan trọng để đánh giá nhà cung cấp...",
  },
  {
    icon: "🛡️",
    title: "Cung Cấp Sản Phẩm Đa Dạng, Phong Phú",
    desc: "Mỗi loại thú cưng lại có đặc điểm và thói quen riêng biệt...",
  },
];

const FeatureItem = ({
  icon,
  title,
  desc,
  align = "left",
}: {
  icon: string;
  title: string;
  desc: string;
  align?: "left" | "right";
}) => (
  <div
    className={`flex items-start gap-4 ${
      align === "right" ? "justify-end text-right" : ""
    }`}
  >
    <div className="text-orange-500 text-3xl">{icon}</div>
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  </div>
);

export default function IntroducePage() {
  return (
    <section className="bg-gradient-to-r from-white via-sky-100 to-orange-50 pb-16">
      <div className="flex justify-center mb-8">
        <Image
          src="/images/intro-img.jpg"
          alt="Hình ảnh giới thiệu trung tâm thú cưng"
          width={1600}
          height={3300}
          className="object-cover"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-2">
          GIỚI THIỆU
        </h2>
        <p className="text-center text-gray-500 mb-12">
          PET LIKE US AND SO WILL YOU
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-8">
            {leftData.map((item) => (
              <FeatureItem key={item.title} {...item} align="right" />
            ))}
          </div>

          <div className="flex justify-center">
            <Image
              src="/images/cute-dog.jpg"
              alt="Pet"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>

          <div className="space-y-8">
            {rightData.map((item) => (
              <FeatureItem key={item.title} {...item} align="left" />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-orange-500 mb-4">
          Station is house, happiness, respect & responsibility 
          </h3>
          <p className="text-gray-500 max-w-5xl mx-auto">
          Xây dựng nơi dừng chân lý tưởng của thú cưng. Đem lại cho thú cưng và khách hàng niềm hạnh phúc khi sử dụng các dịch vụ tại Pet Station. 
          Tại Pet Station, chúng tôi không chỉ cung cấp các sản phẩm, mà còn đồng hành cùng người nuôi trong việc chăm sóc thú cưng đúng cách. 
          Bởi chúng tôi hiểu rằng, việc nuôi dưỡng và bảo vệ một thành viên trong gia đình, cần rất nhiều nỗ lực và sự thấu hiểu, hỗ trợ từ cộng đồng. 
          Với sứ mệnh đem đến một không gian mua sắm, chăm sóc toàn diện, Pet Station cung cấp đầy đủ các mẫu mã sản phẩm dành riêng, 
          dịch vụ hứa hẹn đem đến những khoảnh khắc đẹp nhất cho thú cưng. Cửa hàng thú cưng Pet Station là pet shop chuyên cung cấp đồ dùng, quần áo, thức ăn, sữa tắm, chuồng, vòng cổ xích và các phụ kiện cho chó, mèo. 
          Địa chỉ tắm spa, chăm sóc, cắt tỉa lông và trông giữ thú cưng chuyên nghiệp. Với chất lượng dịch vụ tốt nhất, Pet Station luôn được khách hàng tin tưởng và sẽ là điểm đến tuyệt vời dành cho thú cưng.
          </p>
        </div>
      </div>
    </section>
  );
}
