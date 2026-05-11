import { CellArchitectureResourceCenter } from '@/components/lms/resource-center/CellArchitectureResourceCenter'
import { FurTradeRoutesMap } from '@/components/lms/resource-center/FurTradeRoutesMap'
import { InteractiveResourceLibraryCatalog } from '@/components/lms/resource-center/InteractiveResourceLibraryCatalog'
import { SolarSystemResourceCenter } from '@/components/lms/resource-center/SolarSystemResourceCenter'

export default function ResourceCenterPreviewPage() {
  return (
    <main className="min-h-screen bg-[#17352c] p-4 sm:p-6">
      <div className="mx-auto grid max-w-7xl gap-5">
        <InteractiveResourceLibraryCatalog />
        <CellArchitectureResourceCenter />
        <SolarSystemResourceCenter />
        <FurTradeRoutesMap />
      </div>
    </main>
  )
}
