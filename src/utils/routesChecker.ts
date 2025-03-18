
import { dashboardTabs } from "@/components/dashboard/navigation/DashboardTabs";

// Define route patterns to check
const routePatterns = [
  // Auth routes
  "/login",
  "/register",
  
  // Dashboard routes
  "/dashboard",
  
  // Admin routes
  "/clients",
  "/clients/new",
  "/clients/:id", 
  
  // Common routes
  "/invoices",
  "/invoices/new",
  "/invoices/:id",
  "/reports",
  "/reports/new",
  "/reports/:id",
  "/proposals",
  "/proposals/new",
  "/proposals/:id",
  "/contracts",
  "/contracts/new",
  "/contracts/:id",
  "/tickets",
  "/tickets/new",
  "/tickets/:id",
  "/documents",
  "/packages",
  "/settings",
  "/profile"
];

// Map of routes to required roles
const routeAccessMap = {
  "/login": ["public"],
  "/register": ["public"],
  "/dashboard": ["admin", "client"],
  "/clients": ["admin"],
  "/clients/new": ["admin"],
  "/clients/:id": ["admin"],
  "/invoices": ["admin", "client"],
  "/invoices/new": ["admin"],
  "/invoices/:id": ["admin", "client"],
  "/reports": ["admin", "client"],
  "/reports/new": ["admin"],
  "/reports/:id": ["admin", "client"],
  "/proposals": ["admin", "client"],
  "/proposals/new": ["admin"],
  "/proposals/:id": ["admin", "client"],
  "/contracts": ["admin", "client"],
  "/contracts/new": ["admin"],
  "/contracts/:id": ["admin", "client"],
  "/tickets": ["admin", "client"],
  "/tickets/new": ["admin", "client"],
  "/tickets/:id": ["admin", "client"],
  "/documents": ["admin", "client"],
  "/packages": ["admin"],
  "/settings": ["admin", "client"],
  "/profile": ["admin", "client"]
};

// Verify that all routes in the application are configured correctly
export const verifyRoutes = () => {
  console.log("🔍 Verifying application routes configuration...");
  
  // Check that all dashboard tabs have valid paths
  console.log("Checking dashboard tabs...");
  dashboardTabs.forEach(tab => {
    const tabPath = tab.path;
    const tabName = tab.label;
    
    // Check if path exists in our route patterns (simplified check)
    const hasMatchingPattern = routePatterns.some(pattern => {
      // Convert pattern to regex for flexible matching
      const regexPattern = pattern
        .replace(/:[^/]+/g, '[^/]+') // Replace :id with any non-slash content
        .replace(/\//g, '\\/'); // Escape slashes
      
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(tabPath);
    });
    
    if (!hasMatchingPattern) {
      console.warn(`⚠️ Warning: Tab "${tabName}" has path "${tabPath}" that may not match any configured route.`);
    } else {
      console.log(`✅ Tab "${tabName}" has valid path "${tabPath}"`);
    }
  });
  
  // Log route permissions for documentation
  console.log("\nRoute permissions configuration:");
  Object.entries(routeAccessMap).forEach(([route, roles]) => {
    console.log(`${route}: ${roles.join(', ')}`);
  });
  
  console.log("\n✅ Routes verification completed");
};

// Export for testing or direct use
export { routePatterns, routeAccessMap };
