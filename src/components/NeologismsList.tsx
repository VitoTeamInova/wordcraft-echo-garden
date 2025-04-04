
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Neologism } from '@/types/neologism';

interface NeologismsListProps {
  neologisms: Neologism[];
}

export function NeologismsList({ neologisms }: NeologismsListProps) {
  if (neologisms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No neologisms found. Try a different search or add a new one.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[28rem] pr-4">
      <div className="space-y-4">
        {neologisms.map((neologism) => (
          <Card key={neologism.id} className="hover:shadow-md transition-shadow border-l-4 border-l-neologism-accent">
            <CardHeader className="py-3 px-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">{neologism.name}</CardTitle>
                <Badge variant="outline" className="text-xs border-neologism-accent text-neologism-accent">
                  {neologism.category}
                </Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="py-2 px-4">
              <p className="text-sm text-muted-foreground truncate">{neologism.definition}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
