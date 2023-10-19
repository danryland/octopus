<template>
  <q-page class="q-px-lg">
    <div class="widget widget-goal">
      <PieChart :chartData="data" :options="options" />
    </div>
    <div v-if="totalElectric" class="widget widget-elec">
      <h2>⚡ Electric</h2>
      <p class="total">
        {{ totalElectric.toFixed(toFixed) }}/{{ goalElectric.toFixed(toFixed)
        }}<small>kWh</small>
      </p>
      <div class="chart">
        <p v-if="largestElectric" class="top">
          {{ largestElectric.toFixed(toFixed) }}<small>kWh</small>
        </p>
        <p v-else class="top">0.00<small>kWh</small></p>
        <BarChart :chartData="chartElectric" :options="optionsElectric" />
      </div>
      <p>Total {{ totalElectric.toFixed(toFixed) }}<small>kWh</small></p>
    </div>
    <div v-if="totalElectric" class="widget widget-gas">
      <h2>🔥 Gas</h2>
      <p class="total">
        {{ totalGas.toFixed(toFixed) }}/{{ goalGas.toFixed(toFixed)
        }}<small>m<sup>3</sup></small>
      </p>
      <div class="chart">
        <p v-if="largestGas > 0" class="top">
          {{ largestGas.toFixed(toFixed) }}<small>m<sup>3</sup></small>
        </p>
        <p v-else class="top">
          0.00<small>m<sup>3</sup></small>
        </p>
        <BarChart :chartData="chartGas" :options="optionsGas" />
      </div>
      <p>
        Total {{ totalGas.toFixed(toFixed) }}<small>m<sup>3</sup></small>
      </p>
    </div>
  </q-page>
</template>

<!-- https://www.ofgem.gov.uk/average-gas-and-electricity-usage#:~:text=We%20estimate%20the%20typical%20household,on%20energy%20prices%2C%20like%20the

Energy Use

Example – home type and number of residents

Typical annual gas use (kWh)

Typical annual electricity use (kWh)

Typical annual electricity use (multi-rate, such as Economy 7) (kWh)

Low

Flat or 1-bedroom house; 1 to 2 people

7,500

1,800

2,200
Medium

2-3 bedroom house; 2 to 3 people

11,500

2,700

3,900
High

4+ bedroom home; 4 to 5 people

17,000

4,100

6,700 -->

<script>
import { defineComponent, ref, computed, watchEffect } from 'vue';
import { BarChart, PieChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default defineComponent({
  name: 'IndexPage',
  components: { BarChart, PieChart },
  props: {
    accounts: {
      type: Object,
      default: () => ({}),
    },
    chartElectric: {
      type: Object,
      default: () => ({}),
    },
    chartGas: {
      type: Object,
      default: () => ({}),
    },
    meterElectric: {
      type: Array,
      default: () => [],
    },
    meterGas: {
      type: Array,
      default: () => [],
    },
    round: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const toFixed = computed(() => {
      if (props.round) {
        return 2;
      } else {
        return 0;
      }
    });

    const data = ref(null);

    const optionsElectric = ref({
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        // tooltip: {
        //   enabled: false,
        // },
      },
      elements: {
        bar: {
          borderRadius: 10,
        },
      },
      scales: {
        y: {
          ticks: {
            display: false, // This line hides the y-axis labels
          },
          grid: {
            display: false,
          },
        },
        x: {
          ticks: {
            autoSkip: true, // This line will automatically skip labels to prevent overlap
            maxRotation: 0, // This line prevents the labels from rotating
            minRotation: 0, // This line prevents the labels from rotating
          },
        },
      },
    });
    const optionsGas = ref({
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        // tooltip: {
        //   enabled: false,
        // },
      },
      elements: {
        bar: {
          borderRadius: 10,
        },
      },
      scales: {
        y: {
          ticks: {
            display: false, // This line hides the y-axis labels
          },
          grid: {
            display: false,
          },
        },
        x: {
          ticks: {
            autoSkip: true, // This line will automatically skip labels to prevent overlap
            maxRotation: 0, // This line prevents the labels from rotating
            minRotation: 0, // This line prevents the labels from rotating
          },
        },
      },
    });

    const totalElectric = computed(() => {
      return props.meterElectric.reduce((acc, curr) => {
        return acc + curr.consumption;
      }, 0);
    });

    const largestElectric = computed(() => {
      return Math.max(...props.meterElectric.map((item) => item.consumption));
    });

    const totalGas = computed(() => {
      return props.meterGas.reduce((acc, curr) => {
        return acc + curr.consumption;
      }, 0);
    });

    const largestGas = computed(() => {
      return Math.max(...props.meterGas.map((item) => item.consumption));
    });

    const goalElectric = ref(null);
    const goalGas = ref(null);

    const percentTotalElectric = ref(null);
    const percentGoalElectric = ref(null);

    const percentTotalGas = ref(null);
    const percentGoalGas = ref(null);

    watchEffect(() => {
      goalElectric.value = 2700 / 365;
      goalGas.value = 1095.24 / 365;

      percentTotalElectric.value =
        (totalElectric.value / goalElectric.value) * 100;
      percentGoalElectric.value =
        totalElectric.value > goalElectric.value
          ? 0
          : 100 - percentTotalElectric.value;

      percentTotalGas.value = (totalGas.value / goalGas.value) * 100;
      percentGoalGas.value =
        totalGas.value > goalGas.value ? 0 : 100 - percentTotalGas.value;

      data.value = {
        labels: ['Electric', 'Gas'],
        datasets: [
          {
            data: [percentTotalElectric, percentGoalElectric],
            backgroundColor: ['#FCE94F', '#0E012E'],
            borderWidth: 3,
            borderRadius:
              totalElectric.value > goalElectric.value ? 0 : Number.MAX_VALUE, // Change border radius based on totalElectric and goalElectric
            borderColor: '#0E012E',
          },
          {
            data: [percentTotalGas, percentGoalGas],
            backgroundColor: ['#729FCF', '#0E012E'],
            borderWidth: 3,
            borderRadius: totalGas.value > goalGas.value ? 0 : Number.MAX_VALUE, // Change border radius based on totalGas and goalGas
            borderColor: '#0E012E',
          },
        ],
      };
    });

    const options = {
      responsive: true,
      cutout: '30%',
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    };

    return {
      data,
      options,
      optionsElectric,
      optionsGas,
      totalElectric,
      totalGas,
      largestElectric,
      largestGas,
      toFixed,
      goalElectric,
      goalGas,
      percentTotalElectric,
      percentGoalElectric,
      percentTotalGas,
      percentGoalGas,
    };
  },
});
</script>
