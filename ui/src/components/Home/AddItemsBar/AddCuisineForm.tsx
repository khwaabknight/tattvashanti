import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import api from "@/utils/axiosConfig"
import toast from "react-hot-toast"

function AddCuisineForm() {
    const [cuisineForm, setCuisineForm] = useState({
        name: '',
        description: '',
        tags: ''
    });

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCuisineForm({
            ...cuisineForm,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const tagsArray = cuisineForm.tags.split(',').map(tag => tag.trim());
        
        api.post('/api/v1/cuisine', {...cuisineForm, tags: tagsArray})
        .then(_ => {
            toast.success('Cuisine added successfully')
        }).catch(err => {
            console.log(err)
            toast.error('Failed to add cuisine')
        })
    }
  return (
    <div>
        <DialogHeader>
            <DialogTitle>Add Cuisine</DialogTitle>
            <DialogDescription>
                Make changes to the form to add cuisine. Click save when you're done.
            </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" value={cuisineForm.name} className="col-span-3" onChange={changeHandler}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input id="description" name="description" value={cuisineForm.description} className="col-span-3" onChange={changeHandler}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">Tags</Label>
                <Input id="tags" name="tags" value={cuisineForm.tags} className="col-span-3" onChange={changeHandler}/>
            </div>
            <DialogFooter>
                <Button type="submit">Save changes</Button>
            </DialogFooter>
        </form>
    </div>
  )
}

export default AddCuisineForm