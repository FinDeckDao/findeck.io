import { FC } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../Components/ui/form'
import { Button } from '../../Components/ui/button'
import { Input } from '../../Components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../Components/ui/select'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Profile } from '../../../../declarations/backend/backend.did'
import { getThemeVariant, getRoleVariant } from './utils'
import { ProfileFormProps, formSchema } from './Schemas'
import { FaRegSave } from "react-icons/fa"
import { LoaderWithExplanation } from '@/Components/Loaders'

// This form could be used under multiple conditions.
// 1. The user is creating a profile.
// 2. The user is editing their profile.
// Pass in the appropriate function (updater or creator) to handle the form submission.
export const ProfileForm: FC<ProfileFormProps> = (props) => {
  const { userName, shortTerm, longTerm, theme, role, saveProfile, loading } = props

  // 1. Define the form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName,
      shortTerm: shortTerm || "20",
      longTerm: longTerm || "30",
      theme: theme || "System",
      role: role || "Member",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Construct a profile object.
    const profile: Profile = {
      name: values.userName,
      capitalGainsTaxRate: {
        shortTerm: Number(values.shortTerm),
        longTerm: Number(values.longTerm)
      },
      theme: getThemeVariant(values.theme),
      role: getRoleVariant(values.role)
    }
    saveProfile([profile])
  }

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter you name here" {...field} className="w-full rounded-md border-0 p-2 bg-dark text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                    focus:ring-indigo-600 text-sm leading-6"/>
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={"Member"} disabled>
                  <FormControl>
                    <SelectTrigger className="w-full rounded-md border-0 p-2 bg-dark text-white shadow-sm ring-1 ring-inset
            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
            focus:ring-indigo-600 text-sm leading-6">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full rounded-md border-0 p-2 bg-dark text-white shadow-sm ring-1 ring-inset
            ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
            focus:ring-indigo-600 text-sm leading-6">
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Your assigned role.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full rounded-md border-0 p-2 bg-dark text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                    focus:ring-indigo-600 text-sm leading-6">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full rounded-md border-0 p-2 bg-dark text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                    focus:ring-indigo-600 text-sm leading-6">
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Dark">Dark</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose your preferred theme.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Term Capital Gains Percentage</FormLabel>
                <FormControl>
                  <Input placeholder="Example: 30 or 0.3" {...field} className="w-full rounded-md border-0 p-2 bg-dark text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                    focus:ring-indigo-600 text-sm leading-6" />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long Term Capital Gains Percentage</FormLabel>
                <FormControl>
                  <Input placeholder="Example: 20 or 0.2" {...field} className="w-full rounded-md border-0 p-2 bg-dark text-white shadow-sm ring-1 ring-inset
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                    focus:ring-indigo-600 text-sm leading-6"/>
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onSubmit(form.getValues())}
          >
            {loading
              ? <LoaderWithExplanation explanation='Saving Changes...' />
              : <span><FaRegSave className="h-6 w-6 inline-block" /> Save Changes</span>
            }
          </Button>
        </form>
      </Form>
    </div>
  )
}