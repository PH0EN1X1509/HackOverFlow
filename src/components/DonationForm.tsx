
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DonationFormProps {
  onSubmit: (data: DonationFormValues) => void;
}

export interface DonationFormValues {
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  location: string;
  expiry: Date;
  imageUrl: string;
}

const foodTypes = [
  "Prepared Meals",
  "Fresh Produce",
  "Canned Goods",
  "Bread & Baked",
  "Dairy",
  "Meat & Protein",
  "Dry Goods",
  "Beverages",
  "Mixed Items",
];

const quantityOptions = [
  "Small (1-3 meals)",
  "Medium (4-10 meals)",
  "Large (11-25 meals)",
  "Extra Large (25+ meals)",
];

// Placeholder image URLs
const foodImageOptions = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1593759608142-e08b84568198?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
];

const DonationForm = ({ onSubmit }: DonationFormProps) => {
  const [selectedImage, setSelectedImage] = useState(foodImageOptions[0]);

  const form = useForm<DonationFormValues>({
    defaultValues: {
      title: "",
      description: "",
      foodType: "",
      quantity: "",
      location: "",
      expiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      imageUrl: selectedImage,
    },
  });

  const handleFormSubmit = (data: DonationFormValues) => {
    // Add the selected image URL to the form data
    data.imageUrl = selectedImage;
    
    // Pass the form data to the parent component
    onSubmit(data);
    
    // Reset the form
    form.reset();
    
    // Show a success toast
    toast.success("Donation listed successfully!");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 animate-fade-up"
      >
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g., Fresh sandwich platter" 
                  {...field} 
                  className="focus-visible:ring-foodshare-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the food items, quantity, and any storage requirements"
                  className="resize-none focus-visible:ring-foodshare-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="foodType"
            rules={{ required: "Food type is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus:ring-foodshare-500">
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {foodTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            rules={{ required: "Quantity is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approximate Quantity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="focus:ring-foodshare-500">
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {quantityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          rules={{ required: "Pickup location is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pickup Location</FormLabel>
              <FormControl>
                <Input placeholder="Address or landmark" {...field} className="focus-visible:ring-foodshare-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiry"
          rules={{ required: "Expiry date is required" }}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="block mb-2">Choose an Image</FormLabel>
          <div className="grid grid-cols-3 gap-2">
            {foodImageOptions.map((image, index) => (
              <div 
                key={index} 
                className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                  selectedImage === image 
                    ? 'border-foodshare-500 ring-2 ring-foodshare-200' 
                    : 'border-transparent hover:border-foodshare-200'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image} 
                  alt={`Food option ${index + 1}`} 
                  className="h-20 w-full object-cover"
                />
                {selectedImage === image && (
                  <div className="absolute top-1 right-1 bg-foodshare-500 rounded-full w-5 h-5 flex items-center justify-center">
                    <Plus className="h-3 w-3 text-white rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-foodshare-500 hover:bg-foodshare-600 text-white"
        >
          List Donation
        </Button>
      </form>
    </Form>
  );
};

export default DonationForm;
