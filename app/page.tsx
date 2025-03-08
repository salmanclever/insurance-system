"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DynamicForm from "@/components/dynamic-form"
import ApplicationsList from "@/components/applications-list"

export default function InsurancePortal() {
  const [activeTab, setActiveTab] = useState("new-application")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Smart Insurance Application Portal</h1>

      <Tabs defaultValue="new-application" onValueChange={setActiveTab} value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="new-application">New Application</TabsTrigger>
          <TabsTrigger value="my-applications">My Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="new-application">
          <DynamicForm onSubmitSuccess={() => setActiveTab("my-applications")} />
        </TabsContent>

        <TabsContent value="my-applications">
          <ApplicationsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

