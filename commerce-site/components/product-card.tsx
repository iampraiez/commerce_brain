import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  stock?: number;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  description,
  stock,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${id}`}>
        <div className="aspect-video overflow-hidden bg-muted relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            className="object-cover hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-lg hover:text-accent transition-colors truncate">
            {name}
          </h3>
        </Link>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {description}
          </p>
        )}
        <p className="text-lg font-bold text-accent mt-2">
          ${price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href={`/products/${id}`}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
