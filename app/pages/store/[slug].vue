<script lang="ts" setup>
import type { Product } from "~/types/store";

const router = useRouter();
const backTo = computed(() => {
  const from = router.options.history.state.back;
  const defaultBackTo = "/store";

  if (!from) return defaultBackTo;
  if (typeof from !== "string") return defaultBackTo;

  if (from.includes(defaultBackTo)) {
    return from;
  }
});
const route = useRoute();
const productSlug = route.params.slug as string;

const nuxtApp = useNuxtApp();
const { data: product } = await useEdukarAPI<Product>(
  `/store/products/${productSlug}/`,
  {
    key: productSlug,
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

if (!product.value) {
  throw showError({
    statusCode: 404,
    statusMessage: "No existe el producto",
  });
}

type Option = { label: string; value: string };
function buildProductArray(product: Product): Option[] {
  const result: Option[] = [];

  // Add the parent product
  result.push({ label: product.name, value: product.identifier });

  // Add the child items recursively only if it is package
  if (product.type === 2) {
    for (const item of product.items) {
      result.push(...buildProductArray(item));
    }
  }

  return result;
}

type ProductWithoutItems = Omit<Product, "items">;
// Recursive function to build the array
function buildProductArrayWithoutItems(
  product: Product,
): ProductWithoutItems[] {
  const result: ProductWithoutItems[] = [];

  // Create a copy of the product without the 'items' field
  const { items, ...productWithoutItems } = product;
  result.push(productWithoutItems);

  // Add the child items recursively
  for (const item of product.items) {
    result.push(...buildProductArrayWithoutItems(item));
  }

  return result;
}

const products = buildProductArrayWithoutItems(product.value);
const options = buildProductArray(product.value);
const selected = ref(product.value.identifier);
const selectedProduct = computed(() => {
  return products.find((prod) => prod.identifier === selected.value);
});

// recommended products

const { data: recommendations, status: recommendStatus } = useEdukarAPI<
  Product[]
>(`/store/products/${productSlug}/recommendations`, {
  key: `${productSlug}-recommendations`,
  lazy: true,
  getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
});
</script>

<template>
  <section id="store-product">
    <UContainer class="w-full max-w-[1200px]">
      <div class="mb-4">
        <UButton
          size="sm"
          color="gray"
          icon="i-mdi-chevron-left"
          variant="link"
          :to="backTo"
        >
          Volver
        </UButton>
      </div>
      <div class="container mx-auto">
        <!-- <div class="flex justify-end mb-4">
        <UToggle v-model="isPackageView" :options="viewOptions" />
      </div> -->

        <div class="grid md:grid-cols-2 gap-8 items-start">
          <!-- Product/Package Image -->
          <div class="bg-white rounded-lg p-1 max-w-[400px] md:w-full mx-auto">
            <img
              :src="product?.product_image"
              :alt="product?.name"
              class="w-full h-auto object-contain"
            />
          </div>

          <!-- Product/Package Details -->
          <div class="space-y-6">
            <div>
              <Typography tag="h1" variant="h3" color="gray">
                {{ selectedProduct?.name }}
              </Typography>
              <p class="text-gray-800 text-sm mt-2 dark:text-gray-300">
                {{ selectedProduct?.description }}
              </p>
            </div>

            <!-- Package/Product Selection -->
            <div
              v-if="product?.items && product?.items.length > 0"
              class="space-y-4"
            >
              <h3 class="text-lg font-semibold">Escoge una opción:</h3>
              <div class="space-y-2">
                <URadioGroup :options="options" v-model="selected" />
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="space-y-2">
              <UAlert
                icon="i-mdi-wallet"
                description="Puedes comprar este producto usando Yape o Plin"
              />
            </div>

            <!-- Product/Package Code -->
            <div class="flex gap-2 items-center">
              <span class="text-gray-800 dark:text-gray-400">CODIGO:</span>
              <span>{{ selectedProduct?.identifier }}</span>
            </div>

            <!-- Price -->
            <StoreProductPrice :price="selectedProduct?.price" />

            <!-- Stock -->
            <!-- <div class="text-sm text-gray-300">
            Disponible más de {{ selectedProduct?.stock }} unidades
          </div> -->

            <!-- Quantity Selector -->
            <!-- <div class="space-y-2">
            <label class="block text-sm">Cantidad</label>
            <div class="flex items-center gap-2">
              <button
                @click="decrementQuantity"
                class="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
                :disabled="quantity <= 1"
              >
                <MinusIcon class="h-5 w-5" />
              </button>
              <input
                v-model="quantity"
                type="number"
                class="w-16 text-center bg-gray-700 rounded-lg p-2 text-white"
                min="1"
              />
              <button
                @click="incrementQuantity"
                class="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
              >
                <PlusIcon class="h-5 w-5" />
              </button>
            </div>
          </div> -->

            <!-- Add to Cart Button -->
            <StoreButtonAddToCart
              :product="product!"
              class="uppercase text-xl font-medium py-3 px-6"
              block
            />
          </div>
        </div>
      </div>
      <div class="space-y-4 mt-16">
        <h3 class="text-2xl font-bold">Recomendaciones</h3>
        <DataLoading
          :data="recommendations"
          :loading="recommendStatus === 'pending'"
        >
          <template #loading>
            <SkeletonCardList />
          </template>

          <template #data="{ data: prods }">
            <DisplayGrid>
              <StoreProductCard
                v-for="prod in prods"
                :key="`${prod.identifier}-recommend`"
                :product="prod"
              />
            </DisplayGrid>
          </template>
        </DataLoading>
      </div>
    </UContainer>
  </section>
</template>
