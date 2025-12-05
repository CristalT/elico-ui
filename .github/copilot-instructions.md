# Castor eShop - AI Coding Agent Instructions

## Architecture Overview

This is a **Next.js 15 App Router** e-commerce application with a distinct service-oriented API layer architecture.

### Key Architectural Patterns

**Provider Hierarchy**: The app uses nested context providers in a specific order:

```tsx
<QueryProvider>
    <AuthProvider>
        <SettingsProvider>
            <CartProvider>{children}</CartProvider>
        </SettingsProvider>
    </AuthProvider>
</QueryProvider>
```

**Route Groups**: Uses Next.js route groups to separate concerns:

- `app/(main)/` - Public and authenticated user pages
- `app/(checkout)/` - Checkout flow with different layout
- `app/api/` - API routes with authentication middleware

**API Service Layer**: Centralized API client at `app/lib/api/index.ts` with service classes:

```typescript
// Usage pattern throughout the app
import api from '@/lib/api';
api.auth.login(credentials);
api.cart.add.mutate(cartItem);
api.stock.search(query);
```

## Critical Development Patterns

### Authentication & API Routes

**ALL API routes** use the `withAuth` higher-order function pattern:

```typescript
// Required import for ALL API routes
import { withAuth } from '@/lib/auth-api-handler';

// Standard pattern - authenticated routes
export const GET = withAuth<{ id: string }>(async ({ client, params }) => {
    // client is pre-configured with auth token
});

// Guest routes (rare)
export const POST = withAuth(handler, { guest: true });
```

### Form Validation Standard

**React Hook Form + Zod** is the project standard. Every form follows this pattern:

```typescript
const schema = z.object({
    email: z.email({ message: 'Ingrese un correo electrónico válido' }),
    password: z.string().min(6, { message: 'Custom Spanish error message' }),
});

const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
        /* required */
    },
});
```

**Never** use basic HTML validation or manual error handling - always use this Zod pattern.

### Data Fetching with React Query

**SSR + Client Hydration** pattern for product pages:

```typescript
// Server component - prefetch data
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: ['product', id],
  queryFn: () => api.stock.getProduct(id)
});

// Return with HydrationBoundary
return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <ProductDetail productId={id} />
  </HydrationBoundary>
);
```

**Mutations** use React Query for all state updates:

```typescript
const { mutate, isPending } = useMutation({
    mutationFn: api.cart.add,
    onSuccess: () => queryClient.invalidateQueries(['cart']),
});
```

## Component Conventions

### UI Components

- Use `@/components/ui/*` from the established component library
- Always apply `border-2 border-black` styling for primary buttons
- Product images use the `ProductImage` component (handles fallbacks)

### Context Usage

Access contexts through custom hooks, never directly:

```typescript
const auth = useAuth(); // ✅ Correct
const cart = useCart(); // ✅ Correct
const settings = useSettings(); // ✅ Correct
```

### File Organization

```
app/
├── (main)/           # Main app pages (products, account, etc.)
├── (checkout)/       # Checkout flow with different layout
├── api/             # API routes (all use withAuth)
├── components/      # Shared components
├── context/         # React contexts with custom hooks
├── lib/
│   ├── api/         # Service layer classes
│   └── auth-api-handler.ts  # API route authentication wrapper
└── providers/       # Query client and other providers
```

## Development Workflow

### Running the App

```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # ESLint + Prettier
```

### Adding New Features

1. **New API Route**: Always start with `withAuth` wrapper from `@/lib/auth-api-handler`
2. **New Form**: Create Zod schema first, then use React Hook Form pattern
3. **New Page**: Check if it needs cart/auth context, add to appropriate route group
4. **Data Fetching**: Use React Query with the existing API service classes

### Key Dependencies

- **TanStack Query**: All server state (cache keys: `['cart']`, `['product', id]`, `['auth']`)
- **Zod + React Hook Form**: All form validation (never use basic HTML validation)
- **Tailwind CSS**: Styling (prefer existing component patterns)
- **Lucide React**: All icons

## Critical Files to Understand

- `app/lib/api/index.ts` - Central API client and service registration
- `app/lib/auth-api-handler.ts` - API route authentication wrapper
- `app/context/*-provider.tsx` - Context providers with custom hooks
- `app/(main)/layout.tsx` - Main app layout with header/footer

## Common Pitfalls to Avoid

- Don't create API routes without `withAuth` wrapper
- Don't use fetch directly - use the service layer (`api.*`)
- Don't access contexts directly - use the custom hooks
- Don't skip Zod validation on forms
- Don't forget to update TypeScript interfaces when adding new API fields
