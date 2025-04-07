import Image from "next/image";
//import dogImage from "../../../public/images/dog.jpg";

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

const FeatureItem = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="flex items-start gap-4">
    <div className="text-orange-500 text-3xl">{icon}</div>
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  </div>
);

export default function IntroducePage() {
  return (
    <section className="py-16 bg-white">
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
              <FeatureItem key={item.title} {...item} />
            ))}
          </div>

          <div className="flex justify-center">
            <Image
              src="/images/dog.jpg"
              // src={dogImage}
              alt="Pet"
              width={200}
              height={300}
              className="object-contain"
            />
          </div>

          <div className="space-y-8">
            {rightData.map((item) => (
              <FeatureItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
