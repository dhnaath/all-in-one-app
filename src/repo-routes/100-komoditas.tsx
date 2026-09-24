import { createFileRoute } from '@tanstack/react-router'
import { CommodityDashboard } from './commodity-dashboard'

export const Route = createFileRoute('/100-komoditas')({
  component: Komoditas100Component,
})

function Komoditas100Component() {
  return <CommodityDashboard />
}

