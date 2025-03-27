import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, PenTool as Tool, CheckCircle, Wrench, Drill, Hammer, Save as Saw, ArrowRight, Phone, Star, Clock, DollarSign, ChevronDown, ChevronUp, Calendar, MapPin, Shield, PenTool as ToolIcon } from 'lucide-react';
import { Logo } from './Logo';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600">{answer}</p>
      )}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <Icon className="w-12 h-12 text-[#FFD700] mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ProcessStep({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-10 h-10 bg-[#FFD700] text-gray-900 rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function ToolCategory({ icon: Icon, name, image }: { icon: any, name: string, image: string }) {
  return (
    <div className="relative group overflow-hidden rounded-lg">
      <img 
        src={image} 
        alt={name}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
        <Icon className="w-12 h-12 text-[#FFD700] mb-3" />
        <h3 className="text-xl font-bold text-white">{name}</h3>
      </div>
    </div>
  );
}

function PricingCard({ title, price, features }: { title: string, price: string, features: string[] }) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-4xl font-bold mb-6">{price}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="w-5 h-5 text-[#FFD700] mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <button className="w-full mt-8 bg-[#FFD700] text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-[#FFE44D] transition-colors">
        Choose Plan
      </button>
    </div>
  );
}

function TestimonialCard({ name, role, quote, image }: { name: string; role: string; quote: string; image: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover mr-4" />
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic">"{quote}"</p>
    </div>
  );
}

export function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          {/* Updated overlay to make image darker */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80"
            alt="Professional construction tools"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 min-h-screen flex items-center">
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Professional Tools,
                <br />
                <span className="text-[#FFD700]">Delivered to Your Door</span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Get the right tools when you need them. Fast delivery, professional-grade equipment, and hassle-free returns.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/tools"
                  className="bg-[#FFD700] text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#FFE44D] transition-colors flex items-center group"
                >
                  Rent Now 
                  <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://wa.me/66933880630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors flex items-center"
                >
                  <Phone className="mr-2 w-5 h-5" /> Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Tool2U?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Clock}
              title="Same-Day Delivery"
              description="Get your tools delivered within hours, not days. Available 7 days a week."
            />
            <FeatureCard
              icon={Star}
              title="Professional Grade"
              description="Access to top-quality tools from trusted brands, maintained to the highest standards."
            />
            <FeatureCard
              icon={DollarSign}
              title="Cost-Effective"
              description="Save money by renting professional tools instead of buying. No maintenance costs."
            />
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-20 bg-gray-100" id="tools">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Popular Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ToolCategory 
              icon={Drill} 
              name="Power Tools" 
              image="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80"
            />
            <ToolCategory 
              icon={Wrench} 
              name="Hand Tools" 
              image="https://images.unsplash.com/photo-1581147036324-c1c88bb273b4?auto=format&fit=crop&q=80"
            />
            <ToolCategory 
              icon={Hammer} 
              name="Construction" 
              image="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80"
            />
            <ToolCategory 
              icon={Saw} 
              name="Woodworking" 
              image="https://images.unsplash.com/photo-1575908539614-ff89490f4a78?auto=format&fit=crop&q=80"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="max-w-3xl mx-auto space-y-12">
            <ProcessStep
              number={1}
              title="Browse & Select"
              description="Choose from our extensive catalog of professional-grade tools."
            />
            <ProcessStep
              number={2}
              title="Schedule Delivery"
              description="Pick your preferred delivery time, even same-day delivery options."
            />
            <ProcessStep
              number={3}
              title="Get to Work"
              description="Receive your tools and start your project with confidence."
            />
            <ProcessStep
              number={4}
              title="Easy Return"
              description="We'll pick up the tools when you're done. It's that simple!"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="John Smith"
              role="Home Renovator"
              quote="Tool2U saved me thousands on equipment I only needed for a weekend project. The delivery was prompt and the tools were in perfect condition."
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
            />
            <TestimonialCard
              name="Sarah Johnson"
              role="Professional Contractor"
              quote="As a contractor, having reliable tools delivered to different job sites has been a game-changer for my business."
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
            />
            <TestimonialCard
              name="Mike Wilson"
              role="DIY Enthusiast"
              quote="The quality of their tools and the convenience of delivery make every project so much easier. Highly recommended!"
              image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white" id="pricing">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Daily Rental"
              price="From $29/day"
              features={[
                "24-hour rental period",
                "Free delivery & pickup",
                "Basic insurance included",
                "24/7 support"
              ]}
            />
            <PricingCard
              title="Weekly Rental"
              price="From $149/week"
              features={[
                "7-day rental period",
                "Free delivery & pickup",
                "Extended insurance",
                "Priority support",
                "20% bulk discount"
              ]}
            />
            <PricingCard
              title="Monthly Rental"
              price="From $499/month"
              features={[
                "30-day rental period",
                "Free delivery & pickup",
                "Premium insurance",
                "Dedicated support",
                "30% bulk discount",
                "Flexible return dates"
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <FAQItem
              question="How does the delivery process work?"
              answer="We deliver tools directly to your location within our service area. Once you place an order, you'll receive a delivery window, and our professional team will bring the equipment right to your door."
            />
            <FAQItem
              question="What if I need to extend my rental period?"
              answer="You can easily extend your rental period through our website or by calling our customer service. As long as the tools haven't been reserved by another customer, extensions are usually approved instantly."
            />
            <FAQItem
              question="Are the tools insured?"
              answer="Yes, all our rentals come with basic insurance coverage. Additional coverage options are available for longer-term rentals or high-value equipment."
            />
            <FAQItem
              question="What is your service area?"
              answer="We currently serve the greater metropolitan area within a 50-mile radius. Enter your zip code on our website to check if we deliver to your location."
            />
          </div>
        </div>
      </section>

      {/* Quality Guarantee */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Our Quality Guarantee</h2>
            <p className="text-xl text-gray-600 mb-8">
              Every tool is thoroughly inspected, maintained, and tested before delivery. If you're not completely satisfied, we'll replace the tool or refund your rental - no questions asked.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left mt-12">
              <div className="text-center">
                <ToolIcon className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                <h3 className="font-bold mb-2">Professional Grade</h3>
                <p className="text-gray-600">Top brands and latest models</p>
              </div>
              <div className="text-center">
                <Calendar className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                <h3 className="font-bold mb-2">Regular Maintenance</h3>
                <p className="text-gray-600">Serviced after every rental</p>
              </div>
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                <h3 className="font-bold mb-2">Reliable Delivery</h3>
                <p className="text-gray-600">On-time, every time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers who trust Tool2U</p>
          <button className="bg-[#FFD700] text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#FFE44D] transition-colors inline-flex items-center group">
            Browse Tools 
            <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Logo variant="light" className="mx-auto mb-6" />
            <p className="opacity-75">Professional tools delivered to your doorstep</p>
            <div className="mt-6">
              <p className="opacity-75">© 2024 Tool2U. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
