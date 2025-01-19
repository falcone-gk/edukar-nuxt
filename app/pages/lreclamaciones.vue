<script lang="ts" setup>
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio."),
    dni: z.string().min(1, "El DNI es obligatorio."),
    email: z.string().email().min(1, "El correo es obligatorio."),
    phone: z.string().min(1, "El teléfono es obligatorio."),
    claim_amount: z.number().min(1, "El monto reclamado es obligatorio."),
    description: z.string().min(1, "La descripción es obligatoria."),
    type_good: z.number(),
    claim_detail: z.string().min(1, "El detalle es obligatorio."),
    request: z.string().min(1, "El pedido es obligatorio."),
    is_minor: z.boolean(),
    proxy_name: z.string(),
  })
  .refine(
    (data) => {
      if (data.is_minor && !data.proxy_name) {
        return false;
      }
      return true;
    },
    {
      message:
        "El nombre del apoderado es obligatorio si el reclamante es menor de edad.",
      path: ["proxy_name"],
    },
  );

const state = ref({
  name: "",
  dni: "",
  address: "",
  email: "",
  phone: "",
  claim_amount: undefined,
  description: "",
  type_good: undefined,
  claim_detail: "",
  request: "",
  is_minor: false,
  proxy_name: "",
});

const tipoBien = [
  { label: "Producto", value: 1 },
  { label: "Servicio", value: 2 },
];

const { data, status, execute } = useEdukarAPI("store/lreclamaciones", {
  method: "POST",
  body: state,
  immediate: false,
  watch: false,
});

const isOpen = ref(false);
const { showNotification } = useNotification();
async function onSubmit() {
  await execute();
  if (!data.value) {
    showNotification({
      type: "error",
      title: "Error al enviar reclamo",
      message:
        "Hubo un problema al enviar tu reclamo. Por favor contactar con soporte",
    });
  } else {
    isOpen.value = true;
  }
}
</script>

<template>
  <!-- Modal for success claim -->
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <Typography tag="h2" variant="h3"> Reclamación realizada </Typography>
      </template>

      <div>
        <p>
          Hemos recibido tu reclamo. Trabajaremos para solucionarlo lo más
          pronto posible
        </p>
      </div>

      <template #footer>
        <UButton label="Aceptar" to="/" />
      </template>
    </UCard>
  </UModal>

  <UCard
    :ui="{
      base: 'mx-auto max-w-[700px]',
    }"
  >
    <template #header>
      <div class="text-center">
        <h1 class="text-xl font-bold"></h1>

        <Typography tag="h1" variant="h1" color="gray"
          >Formulario de Reclamo</Typography
        >
        <p class="text-sm text-gray-600">
          Por favor completa todos los campos requeridos (<span
            class="text-red-500"
            >*</span
          >)
        </p>
      </div>
    </template>

    <UForm
      id="reclamo-form"
      ref="form"
      :state="state"
      :schema="schema"
      @submit="onSubmit"
    >
      <div class="space-y-8 divide-y-2">
        <div>
          <Typography tag="h2" variant="h3" color="gray" class="mb-4"
            >Identificación del consumidor reclamante</Typography
          >
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Identificación del consumidor reclamante -->
            <UFormGroup label="Nombre" name="name" required>
              <UInput v-model="state.name" placeholder="Ingresa tu nombre" />
            </UFormGroup>
            <UFormGroup label="Domicilio" name="address" required>
              <UInput
                v-model="state.address"
                placeholder="Ingresa tu domicilio"
              />
            </UFormGroup>
            <UFormGroup label="DNI/CE" name="dni" required>
              <UInput v-model="state.dni" placeholder="Ingresa tu DNI o CE" />
            </UFormGroup>
            <UFormGroup label="Correo" name="email" required>
              <UInput
                v-model="state.email"
                placeholder="Ingresa tu número telefónico o correo"
              />
            </UFormGroup>
            <UFormGroup label="Teléfono" name="phone" required>
              <UInput
                v-model="state.phone"
                placeholder="Ingresa tu número telefónico o correo"
              />
            </UFormGroup>
          </div>
        </div>

        <div>
          <Typography tag="h2" variant="h3" color="gray" class="my-4">
            Identificación del bien contratado
          </Typography>

          <!-- Identificación del bien contratado -->
          <div class="grid grid-cols-1 gap-4 mt-6">
            <UFormGroup label="Tipo de Bien" name="type_good" required>
              <USelect v-model.number="state.type_good" :options="tipoBien">
                <option value="" disabled>Seleccionar tipo de bien</option>
                <option value="producto">Producto</option>
                <option value="servicio">Servicio</option>
              </USelect>
            </UFormGroup>
            <UFormGroup label="Monto Reclamado" name="claim_amount" required>
              <UInput
                v-model="state.claim_amount"
                type="number"
                placeholder="Ingresa el monto reclamado"
              />
            </UFormGroup>
            <UFormGroup label="Descripción" name="description" required>
              <UTextarea
                v-model="state.description"
                placeholder="Describe el bien contratado"
              />
            </UFormGroup>
          </div>
        </div>

        <div>
          <Typography tag="h2" variant="h3" color="gray" class="my-4"
            >Detalle de la reclamación y pedido del consumidor
          </Typography>

          <!-- Detalle de la reclamación y pedido -->
          <div class="grid grid-cols-1 gap-4 mt-6">
            <UFormGroup label="Detalle" name="detalle" required>
              <UTextarea
                v-model="state.claim_detail"
                placeholder="Ingresa el detalle de tu reclamación"
                :rows="5"
              />
            </UFormGroup>
            <UFormGroup label="Pedido" name="request" required>
              <UTextarea
                v-model="state.request"
                placeholder="Ingresa el detalle de tu pedido"
                :rows="3"
              />
            </UFormGroup>
          </div>
        </div>

        <div>
          <Typography tag="h2" variant="h3" color="gray" class="my-4">
            Menor de edad
          </Typography>

          <!-- Menor de edad -->
          <div class="mt-6">
            <UFormGroup
              label="Eres menor de edad"
              name="menor_edad"
              :ui="{ wrapper: 'flex items-center gap-4' }"
            >
              <UCheckbox v-model="state.is_minor" />
            </UFormGroup>
          </div>

          <div
            v-if="state.is_minor"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6"
          >
            <!-- Identificación del consumidor reclamante -->
            <UFormGroup label="Nombre de apoderado" name="proxy_name">
              <UInput
                v-model="state.proxy_name"
                placeholder="Ingresa tu nombre"
              />
            </UFormGroup>
          </div>
        </div>
      </div>

      <UButton :loading="status === 'pending'" type="submit" class="mt-6" block
        >Enviar Reclamo</UButton
      >
    </UForm>
  </UCard>
</template>
