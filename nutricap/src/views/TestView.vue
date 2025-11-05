<template>
  <div class="min-h-screen p-4 grid grid-cols-1 md:grid-cols-2 gap-4"> <Card class="">
      <template #title>Datos del animal</template>
      <template #content>
        <div class="flex flex-col gap-6">

          <Fieldset legend="Datos básicos">
            <div class="grid grid-cols-1 2xl:grid-cols-3 gap-4">

              <div class="flex flex-col gap-2">
                <label for="peso-vivo">Peso vivo (kg)</label>
                <InputNumber id="peso-vivo" mode="decimal" :minFractionDigits="2"
                  class="w-full" />
                </div>

              <div class="flex flex-col gap-2">
                <label for="grasa-butirosa">Grasa butirosa (%)</label>
                <InputNumber id="grasa-butirosa" mode="decimal" :minFractionDigits="2" suffix=" %"
                  placeholder="Ej: 3.80" class="w-full" />
                </div>

              <div class="flex flex-col gap-2">
                <label for="litros-leche">Litros de leche (diarios)</label>
                <InputNumber id="litros-leche" mode="decimal" :minFractionDigits="1" placeholder="Ej: 25.5"
                  class="w-full" />
                </div>
            </div>
          </Fieldset>

          <Fieldset legend="Datos de actividad y reproducción">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <div class="flex flex-col gap-2">
                <label for="act-voluntaria">Actividad voluntaria</label>
                <InputNumber id="act-voluntaria" mode="decimal" placeholder="Ingresar valor" class="w-full" />
                </div>

              <div class="flex flex-col gap-2">
                <label for="act-reproductiva">Actividad reproductiva</label>
                <InputNumber id="act-reproductiva" mode="decimal" placeholder="Ingresar valor" class="w-full" />
                </div>
            </div>
          </Fieldset>

          <Fieldset legend="Datos de movilización">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <div class="flex flex-col gap-2">
                <label for="ganancia-peso">Ganancia diaria (kg)</label>
                <InputNumber id="ganancia-peso" mode="decimal" :minFractionDigits="2" placeholder="Ej: 0.80"
                  class="w-full" />
                </div>

              <div class="flex flex-col gap-2">
                <label for="perdida-peso">Pérdida diaria (kg)</label>
                <InputNumber id="perdida-peso" mode="decimal" :minFractionDigits="2" placeholder="Ej: 0.10"
                  class="w-full" />
                </div>
            </div>
          </Fieldset>

          <Fieldset legend="Datos de gestación">
            <div class="grid grid-cols-1 2xl:grid-cols-3 gap-4">

              <div class="flex flex-col gap-2">
                <label for="peso-cria">Peso nacimiento cría (kg)</label>
                <InputNumber id="peso-cria" mode="decimal" :minFractionDigits="2" placeholder="Ej: 40.50"
                  class="w-full" />
                </div>

              <div class="flex flex-col gap-2">
                <label for="num-crias">Número de crías</label>
                <InputNumber id="num-crias"  placeholder="Ej: 1" class="w-full" />
                </div>

              <div class="flex flex-col gap-2">
                <label for="dias-gestacion">Días de gestación</label>
                <InputNumber id="dias-gestacion" placeholder="Ej: 280" class="w-full" />
                </div>
            </div>
          </Fieldset>

        </div>
      </template>
    </Card>

    <Card class="md:col-start-2 md:row-start-1 md:row-span-2">
      <template #title>Datos de la alimentacion</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
          </p>
      </template>
    </Card>

    <Card class="">
      <template #title>Resultados</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
    </Card>

  </div>
</template>

<script setup>
// Aún no hay lógica
</script>