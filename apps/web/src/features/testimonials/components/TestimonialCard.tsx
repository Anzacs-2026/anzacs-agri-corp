import { Card, CardContent } from '@/components/ui/card'
import type { Testimonial } from '../types'

const TestimonialCard = ({ testimonial }: { testimonial: Pick<Testimonial, 'customer_name' | 'quote' | 'photo_url'> }) => {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4">
        <p className="flex-1 text-forest/80">&ldquo;{testimonial.quote}&rdquo;</p>
        <div className="flex items-center gap-3">
          {testimonial.photo_url && (
            <img src={testimonial.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
          )}
          <span className="text-sm font-medium text-forest">{testimonial.customer_name}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default TestimonialCard
