import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CollaborativeSession } from '@/components/learning/collaborative-session'
import { SmartSearch } from '@/components/learning/smart-search'
import { AchievementsDisplay } from '@/components/learning/achievements-display'

export default function AdvancedFeaturesPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Advanced Features</h1>
          <p className="text-muted-foreground mt-2">
            Explore collaborative learning, AI-powered search, and achievements
          </p>
        </div>

        <Tabs defaultValue="collaborate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
            <TabsTrigger value="search">Smart Search</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="collaborate" className="space-y-6">
            <CollaborativeSession />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <SmartSearch />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementsDisplay />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}