<script lang="ts" setup>
import type { Product } from "~/types/store";

const userStore = useUserStore();
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

const newComment = ref("");
const { status: commentStatus, execute: addComment } = useEdukarAPI<Product>(
  `/store/products/${productSlug}/comment/`,
  {
    immediate: false,
    method: "POST",
    body: {
      comment: newComment,
    },
    watch: false,
  },
);

async function onCommentSubmit() {
  await addComment();
  newComment.value = "";
}

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
  if (product.type === 3) {
    for (const item of product.items) {
      result.push(...buildProductArray(item));
    }
  }

  return result;
}

// Recursive function to build the array
function buildListProducts(product: Product): Product[] {
  const result: Product[] = [];

  result.push(product);

  // Add the child items recursively
  for (const item of product.items) {
    result.push(...buildListProducts(item));
  }

  return result;
}

const products = buildListProducts(product.value);
const options = buildProductArray(product.value);
const selected = ref(product.value.identifier);
const selectedProduct = computed(() => {
  return products.find((prod) => prod.identifier === selected.value);
});

const { getAbsoluteApiUrl } = useAbsoluteApiUrl();

// recommended products
// const { data: recommendations, status: recommendStatus } = useEdukarAPI<
//   Product[]
// >(`/store/products/${productSlug}/recommendations`, {
//   key: `${productSlug}-recommendations`,
//   lazy: true,
//   getCachedData: (key) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
// });
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
              <div>
                <URadioGroup :options="options" v-model="selected" />
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="space-y-2">
              <UAlert
                icon="i-mdi-wallet"
                description="Puedes comprar este producto usando Yape"
              />
            </div>

            <!-- Product/Package Code -->
            <div class="flex gap-2 items-center">
              <span class="text-gray-800 dark:text-gray-400">CODIGO:</span>
              <span>{{ selectedProduct?.identifier }}</span>
            </div>

            <!-- Price -->
            <StoreProductPrice :price="selectedProduct?.price" />

            <!-- Add to Cart Button -->
            <StoreButtonAddToCart
              :product="selectedProduct!"
              class="uppercase text-xl font-medium py-3 px-6"
              block
            />
          </div>
        </div>
      </div>
      <div class="space-y-16 mt-16">
        <div v-if="product?.comments.length! > 0">
          <Typography tag="h2" variant="h2" color="gray" class="mb-2">
            Comentarios:
          </Typography>
          <DisplayGrid>
            <UCard
              v-for="(comment, ind) in product?.comments"
              :key="`comment-${ind}`"
            >
              <template #header>
                <div class="flex gap-2 items-center">
                  <img
                    class="rounded-full w-[48px] h-[48px] max-w-none"
                    :src="getAbsoluteApiUrl(comment.user.picture)"
                    :alt="comment.user.username"
                  />

                  <span>{{ comment.user.username }}</span>
                </div>
              </template>
              {{ comment.comment }}
            </UCard>
          </DisplayGrid>
        </div>
        <div v-if="userStore.isLogged">
          <ClientOnly>
            <Typography tag="h2" variant="h2" color="gray" class="mb-2">
              Deja un comentario:
            </Typography>
            <UTextarea v-model="newComment" placeholder="Escribe aquí..." />
            <UButton
              class="mt-4"
              label="Enviar"
              color="primary"
              :loading="commentStatus === 'pending'"
              :disabled="newComment === ''"
              @click="onCommentSubmit"
            />
          </ClientOnly>
        </div>
        <!-- <DataLoading
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
        </DataLoading> -->
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
:deep(fieldset) {
  width: 100%;
  display: flex;
  flex-direction: column;
}

:deep(label) {
  cursor: pointer;
  width: 100%;
  padding: 10px;
}

:deep(fieldset > .items-start) {
  align-items: center;
  border-radius: 10px;
  width: 100%;
  padding: 0 10px;
  border-radius: 10px;
}

:deep(fieldset > .items-start):hover {
  background-color: rgba(150, 241, 147, 0.178);
}

:deep(fieldset > .items-start > .ms-3) {
  width: 100%;
}
</style>
