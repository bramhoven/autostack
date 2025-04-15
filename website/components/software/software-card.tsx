import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryIcon } from "@/lib/utils/category-icons"

export interface SoftwareItem {
  id: number
  name: string
  category: string
  description: string
  image: string
  popular?: boolean
}

interface SoftwareCardProps {
  software: SoftwareItem
}

export function SoftwareCard({ software }: SoftwareCardProps) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
      <CardHeader className="flex flex-row items-center gap-4 pb-2 relative">
        <div className="bg-gradient-to-br from-muted/80 to-muted/30 p-2 rounded-md border border-border/50 shadow-sm">
          <Image
            src={software.image || "/placeholder.svg"}
            alt={software.name}
            width={50}
            height={50}
            className="rounded-sm"
          />
        </div>
        <div>
          <CardTitle className="flex items-center gap-2">
            {software.name}
            {software.popular && (
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                Popular
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            {getCategoryIcon(software.category)}
            <span className="capitalize">{software.category.replace("-", " ")}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{software.description}</p>
      </CardContent>
      <CardFooter className="bg-muted/30 border-t border-border/50 flex items-center px-6 py-4">
        <Link href={`/install/${software.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full gap-1 border-primary/30 text-primary/80 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors duration-300"
          >
            Install
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
