<script setup>
import DrugDealView from '@/views/DrugDeal.vue';
import BankView from '@/views/Bank.vue';
import LoanSharkView from '@/views/LoanShark.vue';
import GunShopView from '@/views/GunShop.vue';
import FightView from './views/Fight.vue';
import RandomEventView from './views/RandomEvent.vue';
import GameOverView from './views/GameOver.vue';
import DebugView from './views/DebugWindow.vue';
import LogControl from './components/LogControl.vue';

import { ViewService } from './classes/ViewService';
import { ref, onMounted } from 'vue';
import { LMap, LTileLayer, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet';
import { format } from './classes/Utils.js';
import { useGame } from './classes/Game.js';

const game = ref(useGame());
const zoom = ref(15);
const environment = ref(import.meta.env);
const theme = ref('light');
const debug = ref(false);

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem('theme', theme.value);
}

function init() {
  theme.value = localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme') || 'light';
  document.body.addEventListener('mousemove', () => game.value.hasUserInteracted = true);
  document.body.addEventListener('scroll', () => game.value.hasUserInteracted = true);
  document.body.addEventListener('keydown', () => game.value.hasUserInteracted = true);
  document.body.addEventListener('click', () => game.value.hasUserInteracted = true);
  document.body.addEventListener('touchstart', () => game.value.hasUserInteracted = true);
}

onMounted(init);
</script>

<template>
<div class="app">
  <div class="container p-2">
    <div class="columns mb-0">
      <div class="column">
        <p class="title"><font-awesome-icon :icon="['fas', 'cannabis']" class="has-text-success" /> Dope Wars!</p>
      </div>
      <div class="column is-narrow">
        <div class="field has-addons">
          <p class="control">
            <button type="button" class="button" v-if="environment.MODE == 'development'" title="Debug" @click="debug = !debug">
              <font-awesome-icon :icon="['fas', 'bug']" />
            </button>
          </p>
          <p class="control">
            <button type="button" class="button" @click="toggleTheme()" title="Toggle Light/Dark Theme">
              <font-awesome-icon :icon="['fas', theme === 'light' ? 'sun' : 'moon']" />
            </button>
          </p>
          <p class="control">
            <button type="button" class="button" @click="game.muted = !game.muted" title="Mute/Unmute">
              <font-awesome-icon :icon="['fas', game.muted ? 'volume-xmark' : 'volume-up']" />
            </button>
          </p>
          <p class="control">
            <button type="button" class="button" @click="game.reset()" title="Restart">
              <font-awesome-icon :icon="['fas', 'rotate']" />
            </button>
          </p>
        </div>
      </div>
    </div>

    <debug-view v-model="game" v-if="debug"></debug-view>

    <div class="columns mb-1">
      <div class="column">
        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">Player</label>
            <div class="control">
              <input v-model="game.player.name" class="input" type="text">
            </div>
          </div>
          <div class="control">
            <label class="label">
              Date
              <span class="is-pulled-right" v-if="game.daysRemaining > 0">({{ (game.daysRemaining) > 1 ? game.daysRemaining + ' days' : game.daysRemaining + ' day' }} left)</span>
            </label>
            <div class="control">
              <input :value="format.date(game.date)" class="input has-text-right" style="max-width:125" type="text" readonly disabled>
            </div>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="field">
            <label class="label">Cash</label>
            <div class="control">
              <input :value="format.number(game.player.cash)" class="input has-text-right" readonly disabled>
            </div>
          </div>
          <div class="field">
            <label class="label">Savings</label>
            <div class="control">
              <input :value="format.number(game.player.savings)" class="input has-text-right" readonly disabled>
            </div>
          </div>
          <div class="field">
            <label class="label">Debt</label>
            <div class="control">
              <input :value="format.number(game.player.debt)" class="input has-text-right" readonly disabled>
            </div>
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control is-expanded">
            <label class="label">
              Health
              <span class="is-pulled-right">{{ game.player.health }}%</span>
            </label>
            <div class="control">
              <progress class="progress" :value="game?.player.health" max="100">{{ game.player.health }}%</progress>
            </div>
          </div>

          <div class="control is-expanded">
            <label class="label">
              Space
              <span class="is-pulled-right">({{ game.player.spaceUsed }}/{{ game.player.storageCapacity }})</span>
            </label>
            <div class="control">
              <progress class="progress" :value="game.player.percentageFull || 0" max="100">
                {{ game.player.percentageFull || 0 }}%</progress>
            </div>
          </div>
        </div>
        <div class="buttons mt-5 status-indicators">
          <div class="button">
            <button type="button" class="is-info" :title="game.player.guns.map(x => `${x.name}: Own ${x.quantity} | Space ${x.space * x.quantity} | Damage ${x.damage}`).join('\r\n')">
              <font-awesome-icon :icon="['fas', 'gun']" class="is-size-4 mr-2" />
              <span>{{ game.player.gunCount }}</span>
            </button>
          </div>
          <div class="button">
            <button type="button" class="is-info" :title="`Bitches: ${game.player.bitches}`">
              <font-awesome-icon :icon="['fas', 'person-dress']" class="is-size-4 mr-2" />
              <span>{{ game.player.bitches }}</span>
            </button>
          </div>
          <div class="button">
            <button type="button" class="is-info" :title="`Lungs: ${game.player.lungs}`">
              <font-awesome-icon :icon="['fas', 'lungs']" class="is-size-4 mr-2" />
              <span>{{ game.player.lungs }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <div class="grid is-gapless">
          <div class="cell m-1" v-for="location in game.locations" :key="location.name">
            <button class="button jet-button" type="button" @click="game.jet(location)" v-bind:class="{ 'is-warning': game.location?.name == location.name }" :disabled="!game.canJet || game.location?.name == location.name">
              {{ location.name }}
            </button>
          </div>
        </div>
      </div>
      <div class="column is-5 is-hidden-touch">
        <div class="map-container">
          <l-map ref="map" style="height: 100%; width: 100%;" v-model:zoom="zoom" :center="game.location?.latLong" :use-global-leaflet="false">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap">
            </l-tile-layer>
            <l-marker :lat-lng="game.location?.latLong">
              <l-tooltip>{{ game.location?.name }}</l-tooltip>
            </l-marker>
          </l-map>
        </div>
      </div>
    </div>

    <log-control v-model="game.log" ref="logControl"></log-control>

    <div class="box mt-1" v-if="game.view">
      <bank-view v-if="game.view.type === ViewService.Bank" v-model="game.view.instance"></bank-view>
      <loan-shark-view v-if="game.view.type === ViewService.LoanShark" v-model="game.view.instance"></loan-shark-view>
      <gun-shop-view v-if="game.view.type === ViewService.GunShop" v-model="game.view.instance"></gun-shop-view>
      <game-over-view v-if="game.view.type === ViewService.GameOver" v-model="game.view.instance"></game-over-view>
      <drug-deal-view v-if="game.view.type === ViewService.DrugDeal" v-model="game.view.instance"></drug-deal-view>
      <fight-view v-if="game.view.type === ViewService.Fight" v-model="game.view.instance"></fight-view>
      <random-event-view v-if="game.view.type === ViewService.RandomEvent" v-model="game.view.instance"></random-event-view>
    </div>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>This Dope Wars clone was developed by
          <a target="_blank" href="https://www.linkedin.com/in/michaelceranski/">Michael Ceranski</a>.
          Dope Wars is a game simulating the life of a drug dealer in 1984 New York, based upon the MS-DOS
          game of the same name, in turn derived from "Drug Wars" by John E. Dell. The
          aim of the game is to make lots and lots of money, but unfortunately you start
          the game with a hefty debt to the loan shark (who charges equally hefty interest)
          and the cops take a rather dim view of drug dealing...
        </p>
      </div>
    </footer>
  </div>
</div>
</template>
