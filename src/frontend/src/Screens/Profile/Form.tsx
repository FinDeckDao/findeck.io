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
import { Card, CardContent, CardHeader, CardTitle } from '../../Components/ui/card'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Profile } from '../../../../declarations/backend/backend.did'
import { getThemeVariant, getRoleVariant } from './utils'
import { ProfileFormProps, formSchema } from './Schemas'
import { FaRegSave } from "react-icons/fa"
import { LoaderWithExplanation } from '@/Components/Loaders'

export const ProfileForm: FC<ProfileFormProps> = (props) => {
  const { userName, shortTerm, longTerm, theme, role, saveProfile, loading } = props

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
    <div className="container mx-auto py-6 max-w-7xl px-4">
      <div className="flex justify-center items-center">
        <h1>Profile Settings</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Information Section */}
            <Card className="bg-dark border">
              <CardHeader>
                <CardTitle className="text-white">Personal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name here"
                          {...field}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">
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
                      <FormLabel className="text-slate-200">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={"Member"} disabled>
                        <FormControl>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Member">Member</SelectItem>
                          <SelectItem value="Administrator">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-slate-400">
                        Your assigned role.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tax Settings Section */}
            <Card className="bg-dark border">
              <CardHeader>
                <CardTitle className="text-white">Tax Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="shortTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Short Term Capital Gains Rate</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Example: 30 or 0.3"
                          {...field}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        The tax rate applied to gains from assets held for less than one year.
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
                      <FormLabel className="text-slate-200">Long Term Capital Gains Rate</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Example: 20 or 0.2"
                          {...field}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-slate-400">
                        The tax rate applied to gains from assets held for more than one year.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Appearance Settings Section */}
            <Card className="bg-dark border">
              <CardHeader>
                <CardTitle className="text-white">Appearance</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">Theme</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue placeholder="Select a theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="Light">Light</SelectItem>
                          <SelectItem value="Dark">Dark</SelectItem>
                          <SelectItem value="System">System</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-slate-400">
                        Choose your preferred theme.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
      <div className="flex justify-end items-center mt-4">
        <Button
          onClick={() => onSubmit(form.getValues())}
          className="bg-blue-500 hover:bg-blue-700"
        >
          {loading
            ? <LoaderWithExplanation explanation='Saving Changes...' />
            : (
              <div className="flex items-center gap-2">
                <FaRegSave className="h-4 w-4" />
                <span>Save All Changes</span>
              </div>
            )
          }
        </Button>
      </div>
    </div>
  )
}