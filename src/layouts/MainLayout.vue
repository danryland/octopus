<template>
  <q-layout view="lHh Lpr lFf">
    <q-dialog class="settings" v-model="showSettings">
      <div>
        <q-card style="min-width: 280px; max-width: 400px" class="q-mb-md">
          <q-card-section>
            <div class="text-h6">OctoPulse settings</div>
          </q-card-section>
          <q-card-section>
            <p>Daily goals</p>
            <div class="row q-col-gutter-sm">
              <div class="col-4">
                <q-input label="Total cost" standout rounded v-model="goals.total" mask="##.##" fill-mask="0"
                  class="q-mb-md" />
              </div>
              <div class="col-4">
                <q-input label="Electric" standout rounded v-model="goals.electric" mask="##.##" fill-mask="0" />
              </div>
              <div class="col-4">
                <q-input label="Gas" standout rounded v-model="goals.gas" mask="##.##" fill-mask="0" />
              </div>
            </div>
          </q-card-section>
          <!-- <q-card-section>
            <q-toggle size="md" v-model="round" label="Two decimal places" />
          </q-card-section> -->
          <q-card-actions>
            <q-btn rounded label="Done" no-caps outline color="primary" size="lg" v-close-popup class="full-width" />
          </q-card-actions>
        </q-card>
        <q-card>
          <q-card-section>
            <q-btn outline flat label="Clear API Key & Account ID" color="red" rounded no-caps class="full-width"
              @click="reset()" />
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
    <q-dialog v-model="dialog" :maximized="dialog" persistent seamless transition-show="slide-up"
      transition-hide="slide-down" class="login">
      <q-card class="bg-dark flex">
        <div class="top">
          <div class="full-width">
            <q-img src="~/assets/img/logo-octopus.svg" alt="Octo" />

            <p>
              Octopus API Key &amp; Account ID<br />
              <a @click="
      openURL(
        'https://octopus.energy/dashboard/new/accounts/personal-details/api-access'
      )
      ">Get your key and ID</a>
            </p>
            <q-input v-model="octokey" outlined rounded type="password" label="API Key" stack-label
              placeholder="sk_live_•••••••••••••••••••••••••" />
            <q-input v-model="accountID" outlined rounded type="text" label="Account ID" stack-label
              placeholder="A-••••••••" />
            <q-btn size="lg" color="primary" v-if="octokey && accountID" no-caps rounded text-color="dark"
              class="full-width" label="See my usage" @click="seeUsage()" />
            <p class="legal">
              <a @click="
      openURL(
        'https://octopus.energy/dashboard/new/accounts/personal-details/api-access'
      )
      ">Rest your API key</a>
              at anytime.
            </p>
          </div>
        </div>
        <div class="bottom">
          <div>
            <q-img src="~/assets/img/no-octopus.svg" alt="no Octo" />
            <p>
              No Octopus?<br />
              <a @click="openURL('https://share.octopus.energy/neat-clove-522')">Get Octopus Energy</a>
            </p>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-page-container>
      <q-header class="bg-dark">
        <q-toolbar class="flex column items-center q-py-lg">
          <div class="flex row full-width justify-between items-center q-pb-md q-px-md">
            <div style="width: 40px; text-align: left">
              <q-img style="max-width: 32px" src="~/assets/img/logo-octopus.svg" alt="logo" />
            </div>
            <div class="day-title">
              <template v-if="activeDay === 1">Yesterday,
                {{
      moment().subtract(activeDay, 'days').format('DD MMM')
    }}</template>
              <template v-else>
                {{ moment().subtract(activeDay, 'days').format('ddd, DD MMM') }}
              </template>
            </div>
            <div style="width: 40px; text-align: right">
              <q-icon @click="toggleSettings" size="sm" name="settings" />
            </div>
          </div>
          <div class="days q-px-md flex q-gutter-x-md no-wrap scroll">
            <q-btn class="day" v-for="n in Array(30)
        .fill()
        .map((_, i) => 29 - i)" :key="n" @click="updatePeriod(n + 1)" no-caps round unelevated
              :color="n + 1 === activeDay ? 'primary' : 'default'" :text-color="n + 1 === activeDay ? 'dark' : ''"
              size="sm">
              {{
      moment()
        .subtract(n + 1, 'days')
        .format('dd')
        .charAt(0)
    }}
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>

      <router-view :accounts="accounts" :chartElectric="chartElectric" :chartGas="chartGas"
        :meterElectric="meterElectric" :meterGas="meterGas" :round="round" :isLoading="isLoading" :goal="goal"
        :goalType="goalType" :goals="goals" :chartTotalCost="chartTotalCost" :totalCost="totalCost"
        :largestCost="largestCost" />
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import { defineComponent, onMounted, ref } from 'vue';
import { useQuasar, openURL } from 'quasar';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const debug = ref(false);
    let dialog = ref(true);
    const accounts = ref(null);
    const meterElectric = ref();
    const meterGas = ref();
    const chartElectric = ref({ labels: [], datasets: [] });
    const chartGas = ref({ labels: [], datasets: [] });
    const chartTotalCost = ref({ labels: [], datasets: [] });
    const activeDay = ref(1);
    const periodFrom = ref(
      moment().subtract(activeDay.value, 'days').startOf('day').toISOString()
    );
    const periodTo = ref(
      moment().subtract(activeDay.value, 'days').endOf('day').toISOString()
    );
    const octokey = ref(null);
    const accountID = ref(null);
    const round = ref(true);
    const isLoading = ref(false);
    const $q = useQuasar();
    let showSettings = ref(false);
    const toggleSettings = () => {
      showSettings.value = true;
    };
    const isAgile = ref(false);
    const tariffResults = ref([]);

    const goalType = ref('medium');
    const goals = ref({
      total: 10.00,
      electric: 20.00,
      gas: 10.00,
    });
    const goal = ref({
      low: {
        electric: 1800,
        gas: 711,
      },
      medium: {
        electric: 2700,
        gas: 1090,
      },
      large: {
        electric: 4100,
        gas: 1611,
      },
    });
    const totalCost = ref(0.00);
    const largestCost = ref(0.00);

    const checkStorage = () => {
      //console.log('checkStorage');
      if ($q.localStorage.getItem('octopulse.octokey')) {
        //console.log('Yes has localStore');
        octokey.value = $q.localStorage.getItem('octopulse.octokey');
      } else {
        //console.log('No octokey store');
      }
      if ($q.localStorage.getItem('octopulse.accountID')) {
        //console.log('Yes has localStore');
        accountID.value = $q.localStorage.getItem('octopulse.accountID');
      } else {
        //console.log('No accountID store');
      }
      if (
        $q.localStorage.getItem('octopulse.octokey') &&
        $q.localStorage.getItem('octopulse.accountID')
      ) {
        getAccount();
        dialog.value = false;
      }
    };

    const updatePeriod = async (day) => {
      periodFrom.value = moment()
        .subtract(day, 'days')
        .startOf('day')
        .toISOString();
      periodTo.value = moment()
        .subtract(day, 'days')
        .endOf('day')
        .toISOString();
      await getMeterElectric();
      await getMeterGas();
      getTotalCost();
      activeDay.value = day;
    };

    const getAccount = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get(
          `https://api.octopus.energy/v1/accounts/${accountID.value}`,
          {
            auth: { username: octokey.value, password: '' },
          }
        );

        if (response.status === 200) {
          const propertyPromises = response.data.properties.map(async (property) => {
            if (!property.moved_out_at) {
              const now = new Date();
              const electricTariffs = property.electricity_meter_points[0].agreements;
              const gasTariffs = property.gas_meter_points[0].agreements;

              const electricAgreement = electricTariffs.find((ag) => {
                const validFrom = new Date(ag.valid_from);
                const validTo = new Date(ag.valid_to);
                return now >= validFrom && now <= validTo;
              });

              const electricTariffSections = electricAgreement.tariff_code.split('-');
              const electricProductCode = electricTariffSections.slice(2, 6).join('-');

              const gasAgreement = gasTariffs.find((ag) => {
                const validFrom = new Date(ag.valid_from);
                const validTo = new Date(ag.valid_to);
                return now >= validFrom && now <= validTo;
              });

              const gasTariffSections = gasAgreement.tariff_code.split('-');
              const gasProductCode = gasTariffSections.slice(2, 6).join('-');

              isAgile.value = electricAgreement.tariff_code.includes('AGILE');

              accounts.value = {
                electric: {
                  mpan: property.electricity_meter_points[0].mpan,
                  tariff_code: electricAgreement.tariff_code,
                  product_code: electricProductCode,
                  serial_number:
                    property.electricity_meter_points[0].meters[
                      property.electricity_meter_points[0].meters.length - 1
                    ].serial_number,
                },
                gas: {
                  mprn: property.gas_meter_points[0].mprn,
                  tariff_code: gasAgreement.tariff_code,
                  product_code: gasProductCode,
                  serial_number:
                    property.gas_meter_points[0].meters[0].serial_number,
                },
              };

              await Promise.all([getMeterElectric(), getMeterGas()]);
              getTotalCost();

              if (isAgile.value) {
                //console.log('IS Agile');
                await getAgile();
              } else {
                //console.log('NOT Agile');
              }
            }
          });

          await Promise.all(propertyPromises);
        }
      } catch (error) {
        console.error('Error fetching account:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const getAgile = async () => {
      if (accounts.value && accounts.value.electric.tariff_code) {
        const tariffCode = accounts.value.electric.tariff_code;
        const parts = tariffCode.split('-');
        const productCode = parts.slice(2, 6).join('-');

        const response = await axios.get(
          `https://api.octopus.energy/v1/products/${productCode}/electricity-tariffs/${tariffCode}/standard-unit-rates/`,
          {
            auth: { username: octokey.value, password: '' },
          }
        );
        if (response.status === 200) {
          //console.log('Agile', response.data)
          tariffResults.value = response.data.results
        }
      }
    };

    const getMeterElectric = async () => {
      if (accounts.value && accounts.value.electric) {
        const { mpan, serial_number } = accounts.value.electric;
        const response = await axios.get(
          `https://api.octopus.energy/v1/electricity-meter-points/${mpan}/meters/${serial_number}/consumption`,
          {
            params: {
              period_from: periodFrom.value,
              period_to: periodTo.value,
              //group_by: 'hour',
              order_by: 'period',
            },
            auth: { username: octokey.value, password: '' },
          }
        );

        //console.log('Electric: ', response.data);

        if (response.status === 200) {
          meterElectric.value = response.data.results;
          chartElectric.value = {
            labels: response.data.results.map((item) =>
              moment(item.interval_start).format('HH:mm')
            ),
            datasets: [
              {
                data: response.data.results.map((item) => item.consumption),
                backgroundColor: ['#E9F05C'],
              },
            ],
          };
        }
      }
    };

    const getMeterGas = async () => {
      if (accounts.value && accounts.value.gas) {
        const { mprn, serial_number } = accounts.value.gas;
        const response = await axios.get(
          `https://api.octopus.energy/v1/gas-meter-points/${mprn}/meters/${serial_number}/consumption`,
          {
            params: {
              period_from: periodFrom.value,
              period_to: periodTo.value,
              //group_by: 'hour',
              order_by: 'period',
            },
            auth: { username: octokey.value, password: '' },
          }
        );

        //console.log('Gas: ', response.data.results);

        if (response.status === 200) {
          meterGas.value = response.data.results;
          chartGas.value = {
            labels: response.data.results.map((item) =>
              moment(item.interval_start).format('HH:mm')
            ),
            datasets: [
              {
                data: response.data.results.map((item) => item.consumption),
                backgroundColor: ['#5CBCF0'],
              },
            ],
          };
        }
      }
    };

    const getTotalCost = async () => {
      const electricTariff = accounts.value.electric;
      const gasTariff = accounts.value.gas;

      try {
        const [electricResponse, gasResponse] = await Promise.all([
          axios.get(
            `https://api.octopus.energy/v1/products/${electricTariff.product_code}/electricity-tariffs/${electricTariff.tariff_code}/standard-unit-rates/`,
            {
              params: {
                period_from: periodFrom.value,
                period_to: periodTo.value,
              },
              auth: { username: octokey.value, password: '' },
            }
          ),
          axios.get(
            `https://api.octopus.energy/v1/products/${gasTariff.product_code}/gas-tariffs/${gasTariff.tariff_code}/standard-unit-rates/`,
            {
              params: {
                period_from: periodFrom.value,
                period_to: periodTo.value,
              },
              auth: { username: octokey.value, password: '' },
            }
          ),
        ]);

        let totalCostPerPeriod = [];

        if (electricResponse.status === 200 && gasResponse.status === 200) {
          const gasUnitRate = gasResponse.data.results.length > 0 ? gasResponse.data.results[0].value_inc_vat / 100 : 0;

          // Sort electric response data by valid_from time in ascending order
          const sortedElectricData = electricResponse.data.results.sort((a, b) => {
            return moment(a.valid_from).diff(moment(b.valid_from));
          });

          sortedElectricData.forEach((electricItem) => {
            const matchingElectricEntry = meterElectric.value.find((entry) => {
              const entryStart = moment(entry.interval_start);
              const rateStart = moment(electricItem.valid_from);
              // Adjust for UTC if necessary
              if (!entryStart.isUTC()) {
                entryStart.utc();
              }
              if (!rateStart.isUTC()) {
                rateStart.utc();
              }
              return entryStart.isSame(rateStart, 'minute');
            });

            const electricConsumption = matchingElectricEntry?.consumption || 0;
            const electricCost = (electricItem.value_inc_vat / 100) * electricConsumption;
            const gasConsumption = meterGas.value.reduce((acc, item) => {
              const gasStart = moment(item.interval_start);
              const rateStart = moment(electricItem.valid_from);
              if (!gasStart.isUTC()) {
                gasStart.utc();
              }
              if (!rateStart.isUTC()) {
                rateStart.utc();
              }
              return gasStart.isSame(rateStart, 'minute') ? acc + item.consumption : acc;
            }, 0);
            const gasCost = gasConsumption * gasUnitRate;
            const totalCostForPeriod = electricCost + gasCost;

            totalCostPerPeriod.push({
              time: moment(electricItem.valid_from).format('HH:mm'),
              totalCost: totalCostForPeriod,
            });
          });

          totalCostPerPeriod.sort((a, b) => moment(a.time, 'HH:mm').diff(moment(b.time, 'HH:mm')));

          totalCost.value = totalCostPerPeriod.reduce((acc, item) => acc + item.totalCost, 0).toFixed(2);
          largestCost.value = Math.max(...totalCostPerPeriod.map(item => item.totalCost)).toFixed(2);
          chartTotalCost.value = {
            labels: totalCostPerPeriod.map((item) => item.time),
            datasets: [
              {
                data: totalCostPerPeriod.map((item) => item.totalCost),
                backgroundColor: ['#DE5CF0'],
              }
            ],
          };
        }
      } catch (error) {
        console.error('Error fetching standard unit rates:', error);
      }
    };

    const seeUsage = () => {
      if (octokey.value != null && accountID.value != null) {
        try {
          $q.localStorage.set('octopulse.octokey', octokey.value);
          $q.localStorage.set('octopulse.accountID', accountID.value);
          //console.log('Store');
        } catch (e) {
          console.log(e);
        }

        getAccount();
        dialog.value = false;
      }
    };

    const reset = () => {
      octokey.value = null;
      accountID.value = null;
      $q.localStorage.remove('octopulse.octokey');
      $q.localStorage.remove('octopulse.accountID');
      accounts.value = null;
      meterElectric.value = null;
      meterGas.value = null;
      chartElectric.value = { labels: [], datasets: [] };
      chartGas.value = { labels: [], datasets: [] };
      chartTotalCost.value = { labels: [], datasets: [] };
      dialog.value = true;
    };

    onMounted(() => {
      checkStorage();
    });

    if (debug.value == true) {
      octokey.value = 'sk_live_1uxFsuGnHOycW8Yfjo5upL7O';
      accountID.value = 'A-1C2F6B9D';

      // octokey.value = 'sk_live_yFrxU1mNU2KSXnN3OvaAjG6P';
      // accountID.value = 'A-7214B2FB';
      dialog.value = false;
      getAccount();
    }

    return {
      updatePeriod,
      accounts,
      meterElectric,
      meterGas,
      chartElectric,
      chartGas,
      chartTotalCost,
      totalCost,
      activeDay,
      periodFrom,
      periodTo,
      moment,
      round,
      dialog,
      octokey,
      accountID,
      seeUsage,
      reset,
      isLoading,
      toggleSettings,
      showSettings,
      goalType,
      goal,
      goals,
      openURL,
      largestCost
    };
  },
});
</script>

<style>
.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.q-field--standout .q-field__control {
  padding: 0px 24px;
}
</style>
