export interface DashboardSummaryResponse {
   numberOfOrders: number;
   paidOrders: number;
   unpaidOrders: number;
   numberOfProducts: number;
   numberOfClients: number;
   productsWithNoInventory: number;
   productsWithLowInventory: number;
}
