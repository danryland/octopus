<template>
  <q-layout view="lHh Lpr lFf">
    <q-dialog
      v-model="dialog"
      :maximized="dialog"
      persistent
      seamless
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-dark flex">
        <div class="top">
          <div class="full-width">
            <q-img src="~/assets/img/logo-octopus.svg" alt="Octo" />

            <p>
              Octopus API Key &amp; Account ID<br />
              <a
                href="https://octopus.energy/dashboard/new/accounts/personal-details/api-access"
                >Get your key and ID</a
              >
            </p>
            <q-input
              v-model="octokey"
              outlined
              rounded
              type="password"
              label="API Key"
              stack-label
              placeholder="sk_live_•••••••••••••••••••••••••"
            />
            <q-input
              v-model="accountID"
              outlined
              rounded
              type="text"
              label="Account ID"
              stack-label
              placeholder="A-••••••••"
            />
            <q-btn
              size="lg"
              color="primary"
              v-if="octokey && accountID"
              no-caps
              rounded
              text-color="dark"
              class="full-width"
              label="See my usage"
              @click="seeUsage()"
            />
            <p class="legal">
              <a
                href="https://octopus.energy/dashboard/new/accounts/personal-details/api-access"
                >Rest your API key</a
              >
              at anytime.
            </p>
          </div>
        </div>
        <div class="bottom">
          <div>
            <q-img src="~/assets/img/no-octopus.svg" alt="no Octo" />
            <p>
              No Octopus?<br />
              <a href="https://share.octopus.energy/neat-clove-522"
                >Get Octopus Energy</a
              >
            </p>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-page-container>
      <q-header class="bg-dark">
        <q-toolbar class="flex column items-center q-px-md q-py-lg">
          <div class="flex row full-width justify-between items-center q-pb-md">
            <div style="width: 40px; text-align: left" class="menu">
              <q-img
                style="max-width: 32px"
                src="~/assets/img/logo-octopus.svg"
                alt="logo"
              />
            </div>
            <div class="day-title">
              <template v-if="activeDay === 1"
                >Yesterday,
                {{
                  moment().subtract(activeDay, 'days').format('DD MMM')
                }}</template
              >
              <template v-else>
                {{ moment().subtract(activeDay, 'days').format('ddd, DD MMM') }}
              </template>
            </div>
            <div style="width: 60px; text-align: right">
              <q-toggle size="md" v-model="round" icon="tune" />
            </div>
          </div>
          <div class="days">
            <q-btn
              class="day"
              v-for="n in Array(7)
                .fill()
                .map((_, i) => 6 - i)"
              :key="n"
              @click="updatePeriod(n + 1)"
              no-caps
              round
              unelevated
              :color="n + 1 === activeDay ? 'primary' : 'default'"
              :text-color="n + 1 === activeDay ? 'dark' : ''"
              size="sm"
            >
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

      <router-view
        :accounts="accounts"
        :chartElectric="chartElectric"
        :chartGas="chartGas"
        :meterElectric="meterElectric"
        :meterGas="meterGas"
        :round="round"
      />
      <div class="q-py-xl">
        <q-btn
          size="sm"
          outline
          flat
          label="Clear API Key & Account ID"
          color="red"
          rounded
          no-caps
          class="full-width"
          @click="reset()"
        />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import { defineComponent, ref } from 'vue';

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

    const updatePeriod = (day) => {
      periodFrom.value = moment()
        .subtract(day, 'days')
        .startOf('day')
        .toISOString();
      periodTo.value = moment()
        .subtract(day, 'days')
        .endOf('day')
        .toISOString();
      getMeterElectric();
      getMeterGas();
      activeDay.value = day;
    };

    const getAccount = async () => {
      const response = await axios.get(
        `https://api.octopus.energy/v1/accounts/${accountID.value}`,
        {
          auth: { username: octokey.value, password: '' },
        }
      );

      if (response.status === 200) {
        response.data.properties.forEach((property) => {
          if (!property.moved_out_at) {
            const electricAgreement =
              property.electricity_meter_points[0].agreements.find(
                (ag) => !ag.valid_to
              );
            const gasAgreement = property.gas_meter_points[0].agreements.find(
              (ag) => !ag.valid_to
            );

            accounts.value = {
              electric: {
                mpan: property.electricity_meter_points[0].mpan,
                tariff_code: electricAgreement.tariff_code,
                serial_number:
                  property.electricity_meter_points[0].meters[0].serial_number,
              },
              gas: {
                mprn: property.gas_meter_points[0].mprn,
                tariff_code: gasAgreement.tariff_code,
                serial_number:
                  property.gas_meter_points[0].meters[0].serial_number,
              },
            };

            getMeterElectric();
            getMeterGas();
          }
        });
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
              group_by: 'hour',
              order_by: 'period',
            },
            auth: { username: octokey.value, password: '' },
          }
        );

        if (response.status === 200) {
          meterElectric.value = response.data.results;
          chartElectric.value = {
            labels: response.data.results.map((item) =>
              moment(item.interval_start).format('HH')
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
              group_by: 'hour',
              order_by: 'period',
            },
            auth: { username: octokey.value, password: '' },
          }
        );

        if (response.status === 200) {
          meterGas.value = response.data.results;
          chartGas.value = {
            labels: response.data.results.map((item) =>
              moment(item.interval_start).format('HH')
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

    if (debug.value == true) {
      octokey.value = 'sk_live_1uxFsuGnHOycW8Yfjo5upL7O';
      accountID.value = 'A-1C2F6B9D';
      dialog.value = false;
      getAccount();
    }

    const seeUsage = () => {
      if (octokey.value != null && accountID.value != null) {
        getAccount();
        dialog.value = false;
      }
    };

    const reset = () => {
      octokey.value = null;
      accountID.value = null;
      dialog.value = true;
    };

    return {
      updatePeriod,
      accounts,
      meterElectric,
      meterGas,
      chartElectric,
      chartGas,
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
    };
  },
});
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>
