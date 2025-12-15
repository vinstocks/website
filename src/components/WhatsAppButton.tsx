import WhatsAppIcon from "@/assets/WhatsAppIcon";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi Vinstocks, I would like to know more about your services.");
    window.open(`https://wa.me/917977524553?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-8 right-6 z-50 p-4 rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Contact us on WhatsApp"
      style={{bottom: '3rem'}}
    >
      <WhatsAppIcon className="w-8 h-8 text-white" />
    </button>
  );
};

export default WhatsAppButton;
