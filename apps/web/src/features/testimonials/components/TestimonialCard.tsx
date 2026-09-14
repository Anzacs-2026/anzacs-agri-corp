import { Quote } from 'lucide-react'
import type { Testimonial } from '../types'

const TestimonialCard = ({ testimonial }: { testimonial: Pick<Testimonial, 'customer_name' | 'quote' | 'photo_url'> }) => {
  return (
    <article className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-leaf/20 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(0,43,29,0.55)]">
      <div className="absolute right-5 top-4 text-leaf/25" aria-hidden="true">
        <Quote size={48} strokeWidth={1.5} />
      </div>
      <p className="relative max-w-lg flex-1 pr-10 text-lg leading-8 text-forest/80">{testimonial.quote}</p>
      <div className="mt-6 flex items-center gap-3 border-t border-forest/10 pt-4">
          {testimonial.photo_url && (
            <img src={testimonial.photo_url} alt={`${testimonial.customer_name} profile`} className="h-12 w-12 rounded-full border-2 border-lime object-cover" />
          )}
          <div>
            <span className="block text-sm font-semibold text-forest">{testimonial.customer_name}</span>
            <span className="text-xs uppercase tracking-[0.16em] text-forest/50">Verified customer</span>
          </div>
      </div>
    </article>
  )
}

export default TestimonialCard
