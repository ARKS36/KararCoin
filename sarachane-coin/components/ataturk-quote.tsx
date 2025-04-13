export default function AtaturkQuote() {
  return (
    <section className="py-16 bg-gray-50 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-lg border border-red-100 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64 animate-fadeIn animation-delay-300">
                <img
                  src="/placeholder.svg?height=250&width=250"
                  alt="Türk Bayrağı Tutan Üniversite Öğrencisi"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 animate-fadeIn animation-delay-600">
                Gençliğe Hitabe
              </h2>
              <p className="text-xl md:text-2xl text-red-700 font-semibold mb-4 italic animate-fadeIn animation-delay-900">
                "Ey Türk gençliği! Birinci vazifen; Türk istiklalini, Türk cumhuriyetini, ilelebet muhafaza ve müdafaa
                etmektir."
              </p>
              <p className="text-gray-700 animate-fadeIn animation-delay-1200">
                Mustafa Kemal Atatürk'ün bu sözleri, bizim de platformumuzun temel ilkelerinden biridir. Toplumsal
                değişim ve adalet için mücadele eden her sesi destekliyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=500')] bg-repeat opacity-20"></div>
      </div>
    </section>
  )
}

