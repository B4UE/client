"use client"

import { Suspense, useState } from "react"
import MainLayout from "../components/layouts/main-layout"
import ObjectivesList from "../components/objectives/objectives-list"
import ChatBox from "../components/chat/chat-box"
import ScannedItemsHistory from "../components/scanned-items/scanned-items-history"
import { ObjectivesProvider } from "../contexts/objectives-context"
import { ChatProvider } from "../contexts/chat-context"
import { ScannedItemsProvider } from "../contexts/scanned-items-context"
import { ApiModeProvider } from "../contexts/api-mode-context"
import LoadingSpinner from "../components/ui/loading-spinner"
import LoadingScreen from "../components/loading-screen"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  // No sessionStorage check - loading screen will show every time

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <Suspense fallback={<LoadingSpinner />}>
        <ObjectivesProvider>
          <ChatProvider>
            <ScannedItemsProvider>
              <ApiModeProvider>
                <MainLayout
                  historyTab={
                    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4">
                      <h1 className="text-2xl font-bold mb-4">Scanned Food History</h1>
                      <div className="flex-1 overflow-auto">
                        <ScannedItemsHistory showHeader={false} />
                      </div>
                    </div>
                  }
                >
                  <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4">
                    <div className="mb-2">
                      <ObjectivesList />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <ChatBox />
                    </div>
                  </div>
                </MainLayout>
              </ApiModeProvider>
            </ScannedItemsProvider>
          </ChatProvider>
        </ObjectivesProvider>
      </Suspense>
    </>
  )
}

