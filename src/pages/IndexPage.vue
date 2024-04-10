<template>
  <q-page class="q-px-lg">
    <div v-if="isLoading" class="flex items-center justify-center full-height full-width"
      style="height: 50vh !important">
      <q-spinner-ios color="primary" size="2em" />
    </div>

    <div class="widget widget-goal">
      <PieChart :chartData="data" :options="options" />
    </div>
    <div v-if="totalCost" class="widget widget-cost">
      <h2>💰 Total cost
        <q-icon name="help">
          <q-tooltip anchor="center end" self="center left" class="bg-dark">Doesn't include standing charge</q-tooltip>
        </q-icon>
      </h2>
      <p class="total">
        {{ totalCost }}/{{ goals.total }}
      </p>
      <div class="chart">
        <p v-if="largestCost" class="top">
          {{ largestCost }}
        </p>
        <p v-else class="top">£0.00</p>
        <BarChart :chartData="chartTotalCost" :options="optionsTotalCost" />
      </div>
      <div class="footer">
        <p>Total £{{ totalCost }}</p>
      </div>
    </div>
    <div v-if="totalElectric" class="widget widget-elec">
      <h2>⚡ Electric</h2>
      <p class="total">
        {{ totalElectric.toFixed(toFixed) }}/{{ goalElectric }}<small>kWh</small>
      </p>
      <div class="chart">
        <p v-if="largestElectric" class="top">
          {{ largestElectric.toFixed(toFixed) }}<small>kWh</small>
        </p>
        <p v-else class="top">0.00<small>kWh</small></p>
        <BarChart :chartData="chartElectric" :options="optionsElectric" />
      </div>
      <div class="footer">
        <p>Total {{ totalElectric.toFixed(toFixed) }}<small>kWh</small></p>
        <div class="flex items-center q-gutter-x-sm">
          <q-linear-progress size="8px" rounded :value="progressElectric" color="green" track-color="red" />
          <q-icon v-if="progressElectric === 0" name="wifi_off" size="18px" color="red" />
          <q-icon v-else-if="progressElectric > 0 && progressElectric <= 0.5" name="wifi" size="18px" color="yellow" />
          <q-icon v-else name="wifi" size="18px" color="green" />
        </div>
      </div>
    </div>
    <div v-if="totalElectric" class="widget widget-gas">
      <h2>🔥 Gas</h2>
      <p class="total">
        {{ totalGas.toFixed(toFixed) }}/{{ goalGas }}<small>m<sup>3</sup></small>
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
      <div class="footer">
        <p>
          Total {{ totalGas.toFixed(toFixed) }}<small>m<sup>3</sup></small>
        </p>
        <div class="flex items-center q-gutter-x-sm">
          <q-linear-progress size="8px" rounded :value="progressGas" color="green" track-color="red" />
          <q-icon v-if="progressGas === 0" name="wifi_off" size="18px" color="red" />
          <q-icon v-else-if="progressGas > 0 && progressGas <= 0.5" name="wifi" size="18px" color="yellow" />
          <q-icon v-else name="wifi" size="18px" color="green" />
        </div>
      </div>
    </div>
  </q-page>
</template>

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
    totalCost: {
      type: [String, Number],
      default: '0'
    },
    chartElectric: {
      type: Object,
      default: () => ({}),
    },
    chartGas: {
      type: Object,
      default: () => ({}),
    },
    chartTotalCost: {
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
    isLoading: {
      type: Boolean,
      default: false,
    },
    goalType: {
      type: String,
      default: 'medium',
    },
    goal: {
      type: Object,
      default: () => ({}),
    },
    goals: {
      type: Object,
      default: () => ({}),
    },
    largestCost: {
      type: [String, Number],
      default: 0
    }
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

    const progressElectric = ref(0);
    const progressGas = ref(0);

    const optionsTotalCost = ref({
      responsive: true,
      layout: {
        padding: {
          top: 0
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: 'GB',
          },
        },
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
    const optionsElectric = ref({
      responsive: true,
      layout: {
        padding: {
          top: 0
        }
      },
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
      layout: {
        padding: {
          top: 0
        }
      },
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

    const goalElectric = ref(0);
    const goalGas = ref(0);

    const percentTotalElectric = ref(null);
    const percentGoalElectric = ref(null);

    const percentTotalGas = ref(null);
    const percentGoalGas = ref(null);

    watchEffect(() => {
      updateProgressAndData();
    });

    // watch(() => props.goals, () => {
    //   updateProgressAndData();
    // }, { deep: true });

    function updateProgressAndData() {
      const { total: goalTotalValue, electric: goalElectricValue, gas: goalGasValue } = props.goals;
      goalElectric.value = goalElectricValue;
      goalGas.value = goalGasValue;

      const electricLength = props.meterElectric.length;
      const gasLength = props.meterGas.length;
      progressElectric.value = electricLength / 24;
      progressGas.value = gasLength / 24;

      const totalElectricValue = totalElectric.value;
      const totalGasValue = totalGas.value;
      const totalCostValue = props.totalCost;
      percentTotalElectric.value = (totalElectricValue / goalElectricValue) * 100;
      percentGoalElectric.value = totalElectricValue > goalElectricValue ? 0 : 100 - percentTotalElectric.value;

      percentTotalGas.value = (totalGasValue / goalGasValue) * 100;
      percentGoalGas.value = totalGasValue > goalGasValue ? 0 : 100 - percentTotalGas.value;

      const percentTotalCost = (totalCostValue / goalTotalValue) * 100;
      const percentGoalCost = parseFloat(totalCostValue) > parseFloat(goalTotalValue) ? 0 : 100 - percentTotalCost;

      const borderRadiusElectric = parseFloat(totalElectricValue) > parseFloat(goalElectricValue) ? 0 : Number.MAX_VALUE;
      const borderRadiusGas = parseFloat(totalGasValue) > parseFloat(goalGasValue) ? 0 : Number.MAX_VALUE;
      const borderRadiusTotalCost = parseFloat(totalCostValue) > parseFloat(goalTotalValue) ? 0 : Number.MAX_VALUE;

      console.log(percentTotalCost, percentGoalCost)
      console.log(percentTotalElectric.value, percentGoalElectric.value)

      data.value = {
        labels: ['Total cost', 'Electric', 'Gas'],
        datasets: [
          {
            data: [percentTotalCost, percentGoalCost],
            backgroundColor: ['#DE5CF0', '#0E012E'],
            borderWidth: 3,
            borderRadius: borderRadiusTotalCost,
            borderColor: '#0E012E',
          },
          {
            data: [percentTotalElectric.value, percentGoalElectric.value],
            backgroundColor: ['#E9F05C', '#0E012E'],
            borderWidth: 3,
            borderRadius: borderRadiusElectric,
            borderColor: '#0E012E',
          },
          {
            data: [percentTotalGas.value, percentGoalGas.value],
            backgroundColor: ['#729FCF', '#0E012E'],
            borderWidth: 3,
            borderRadius: borderRadiusGas,
            borderColor: '#0E012E',
          },
        ],
      };
    }

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
      optionsTotalCost,
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
      progressElectric,
      progressGas,
    };
  },
});
</script>
