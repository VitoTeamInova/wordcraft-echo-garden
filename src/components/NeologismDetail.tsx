
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNeologism } from '@/context/NeologismContext';
import { Neologism, NeologismStatus } from '@/types/neologism';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, ArrowLeft } from 'lucide-react';

export const NeologismDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { neologisms, categories, updateNeologism } = useNeologism();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const neologism = neologisms.find(n => n.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Neologism>>(neologism || {});
  const [rootWordsInput, setRootWordsInput] = useState(neologism?.rootWords.join(', ') || '');

  if (!neologism) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-lg text-muted-foreground">Neologism not found</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRootWordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRootWordsInput(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    const category = categories.find(cat => cat.id === value);
    setFormData({ 
      ...formData, 
      categoryId: value,
      category: category?.name
    });
  };

  const handleStatusChange = (value: NeologismStatus) => {
    setFormData({ ...formData, status: value });
  };

  const handleSave = () => {
    if (!formData.name || !formData.definition || !formData.categoryId || !rootWordsInput) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const rootWords = rootWordsInput.split(',').map(word => word.trim());
    
    if (rootWords.length > 3) {
      toast({
        title: "Error",
        description: "Maximum 3 root words allowed",
        variant: "destructive"
      });
      return;
    }

    const updatedNeologism = {
      ...neologism,
      ...formData,
      rootWords
    };

    updateNeologism(updatedNeologism);
    setIsEditing(false);
    
    toast({
      title: "Success",
      description: "Neologism updated successfully"
    });
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData(neologism);
      setRootWordsInput(neologism.rootWords.join(', '));
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      
      <Card className="border-l-4 border-l-neologism-accent">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div>
            {isEditing ? (
              <Input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-xl font-bold" 
              />
            ) : (
              <CardTitle className="text-2xl">{neologism.name}</CardTitle>
            )}
            <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs border-neologism-accent text-neologism-accent">
                {isEditing ? (
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-full border-none p-0 h-auto">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  neologism.category
                )}
              </Badge>
              <span>•</span>
              <Badge variant={neologism.status === 'Ready' ? 'default' : 'secondary'}>
                {isEditing ? (
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleStatusChange(value as NeologismStatus)}
                  >
                    <SelectTrigger className="w-full border-none p-0 h-auto">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Ready">Ready</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  neologism.status
                )}
              </Badge>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleEditMode}
            className="ml-auto"
          >
            {isEditing ? (
              <>Cancel</>
            ) : (
              <><Edit className="h-4 w-4 mr-1" /> Edit</>
            )}
          </Button>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="py-4 space-y-4">
          {neologism.imageUrl && (
            <div className="mb-4">
              <img 
                src={neologism.imageUrl} 
                alt={neologism.name} 
                className="w-full max-h-64 object-cover rounded-md" 
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Root Words</Label>
              {isEditing ? (
                <Input 
                  value={rootWordsInput}
                  onChange={handleRootWordsChange}
                  placeholder="Separate words with commas (max 3)"
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {neologism.rootWords.map((word, idx) => (
                    <Badge key={idx} variant="secondary">{word}</Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <Label className="text-sm font-medium">Definition</Label>
              {isEditing ? (
                <Textarea 
                  name="definition"
                  value={formData.definition}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="mt-1 text-sm leading-relaxed">{neologism.definition}</p>
              )}
            </div>
            
            <div>
              <Label className="text-sm font-medium">Created</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(neologism.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
        
        {isEditing && (
          <CardFooter className="flex justify-end pt-0">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
