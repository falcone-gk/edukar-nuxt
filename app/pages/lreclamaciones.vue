<script lang="ts" setup>
import { z } from "zod";

const schema = z
  .object({
    nombre: z.string().min(1, "El nombre es obligatorio."),
    domicilio: z.string().min(1, "El domicilio es obligatorio."),
    dni: z.string().min(1, "El DNI es obligatorio."),
    telefono: z.string().min(1, "El teléfono es obligatorio."),
    correo: z
      .string()
      .email("El correo debe ser una dirección válida.")
      .min(1, "El correo es obligatorio."),
    tipoBien: z.string().min(1, "El tipo de bien es obligatorio."),
    montoReclamado: z.number().min(1, "El monto reclamado es obligatorio."),
    descripcion: z.string().min(1, "La descripción es obligatoria."),
    tipoReclamacion: z
      .string()
      .min(1, "El tipo de reclamación es obligatorio."),
    detalle: z.string().min(1, "El detalle es obligatorio."),
    pedido: z.string().min(1, "El pedido es obligatorio."),
    menorDeEdad: z.boolean(),
    nombreApoderado: z
      .string()
      .min(1, "El nombre del apoderado es obligatorio.")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.menorDeEdad && !data.nombreApoderado) {
        return false;
      }
      return true;
    },
    {
      message:
        "El nombre del apoderado es obligatorio si el reclamante es menor de edad.",
      path: ["nombreApoderado"], // Apunta al campo específico con el error
    },
  );

const state = ref({
  nombre: "",
  domicilio: "",
  dni: "",
  telefono: "",
  correo: "",
  tipoBien: "",
  montoReclamado: "",
  descripcion: "",
  tipoReclamacion: "",
  detalle: "",
  pedido: "",
  menorDeEdad: false,
  nombreApoderado: "",
});

const tipoBien = ["Producto", "Servicio"];
const tipoReclamo = ["Reclamo", "Queja"];

function onSubmit() {}
</script>

<template>
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
            <UFormGroup label="Nombre" name="nombre" required>
              <UInput v-model="state.nombre" placeholder="Ingresa tu nombre" />
            </UFormGroup>
            <UFormGroup label="Domicilio" name="domicilio" required>
              <UInput
                v-model="state.domicilio"
                placeholder="Ingresa tu domicilio"
              />
            </UFormGroup>
            <UFormGroup label="DNI/CE" name="dni" required>
              <UInput v-model="state.dni" placeholder="Ingresa tu DNI o CE" />
            </UFormGroup>
            <UFormGroup label="Teléfono" name="telefono" required>
              <UInput
                v-model="state.telefono"
                placeholder="Ingresa tu número telefónico"
              />
            </UFormGroup>
            <UFormGroup label="Correo electrónico" name="correo" required>
              <UInput
                v-model="state.correo"
                type="email"
                placeholder="Ingresa tu correo electrónico"
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
            <UFormGroup label="Tipo de Bien" name="tipoBien" required>
              <USelect v-model="state.tipoBien" :options="tipoBien">
                <option value="" disabled>Seleccionar tipo de bien</option>
                <option value="producto">Producto</option>
                <option value="servicio">Servicio</option>
              </USelect>
            </UFormGroup>
            <UFormGroup label="Monto Reclamado" name="montoReclamado" required>
              <UInput
                v-model="state.montoReclamado"
                type="number"
                placeholder="Ingresa el monto reclamado"
              />
            </UFormGroup>
            <UFormGroup label="Descripción" name="descripcion" required>
              <UTextarea
                v-model="state.descripcion"
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
            <UFormGroup
              label="Tipo de Reclamación"
              name="tipoReclamacion"
              required
            >
              <USelect v-model="state.tipoReclamacion" :options="tipoReclamo">
                <option value="" disabled>
                  Seleccionar tipo de reclamación
                </option>
                <option value="queja">Queja</option>
                <option value="reclamo">Reclamo</option>
              </USelect>
            </UFormGroup>
            <UFormGroup label="Detalle" name="detalle" required>
              <UTextarea
                v-model="state.detalle"
                placeholder="Ingresa el detalle de tu reclamación"
                :rows="5"
              />
            </UFormGroup>
            <UFormGroup label="Pedido" name="pedido" required>
              <UTextarea
                v-model="state.pedido"
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
              <UCheckbox v-model="state.menorDeEdad" />
            </UFormGroup>
          </div>

          <div
            v-if="state.menorDeEdad"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6"
          >
            <!-- Identificación del consumidor reclamante -->
            <UFormGroup label="Nombre de apoderado" name="nombreApoderado">
              <UInput
                v-model="state.nombreApoderado"
                placeholder="Ingresa tu nombre"
              />
            </UFormGroup>
          </div>
        </div>
      </div>

      <UButton type="submit" class="mt-6" block :loading="false"
        >Enviar Reclamo</UButton
      >
    </UForm>
  </UCard>
</template>
