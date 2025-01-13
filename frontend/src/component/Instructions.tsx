import { Upload, Share2, Download } from 'lucide-react'

export default function Instructions() {
  const steps = [
    { icon: Upload, title: "Upload", description: "Select and upload your file securely" },
    { icon: Share2, title: "Share", description: "Generate a link or QR code to share" },
    { icon: Download, title: "Receive", description: "Recipients can easily download the file" },
  ]

  return (
    <section id="how-to-share" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-10">
          How to Share Files
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white dark:bg-gray-700 rounded-full">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

