<script>
import JsonView from 'vue-json-viewer';

export default {
  name: 'MainPage',
  components: { JsonView },
  data: () => ({
    loading: false,
    filename: null,
    page: 0,
    per: 20,
    json: null,
    showing_json: [],
    json_type: 'array',
    object_array_key: null,
    error: false,
  }),
  computed: {
    pageLimit() {
      const length = this.object_array_key ? this.json[this.object_array_key].length : this.json.length;
      return Math.ceil(length / this.per)
    }
  },
  methods: {
    loadFile({ target: { files }}) {
      this.filename = files[0].name;
      const fileReader = new FileReader();

      fileReader.onload = this.readJson;
      fileReader.readAsText(files[0]);
    },
    readJson({ target: { result } }) {
      try {
        const json = JSON.parse(result);

        this.json = json;
        this.json_type = Array.isArray(json) ? 'array' : 'object';
        if (this.json_type === 'object') this.getObjectArrayKey();

        this.loadMore();
      } catch(err) {
        this.error = true;
      }
    },
    getObjectArrayKey() {
      const entries = Object.entries(this.json);
      entries.forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > this.per) {
          this.object_array_key = key;
        }
      })
    },
    getStartAndEnd() {
      let start = (this.page - 1) * this.per;
      let end = this.page * this.per;

      start = start < 0 ? 0 : start;
      return [start, end];
    },
    loadMore(is_top = false) {
      if (this.loading) return;

      this.page += is_top ? -1 : 1;
      this.page = this.page < 1 ? 1 : this.page;

      this.json_type == 'array' ? this.loadMoreArray(top) : this.loadMoreObject(top);

      this.loading = true;
      setTimeout(() => this.loading = false, 500);
    },
    loadMoreObject() {
      if (!this.object_array_key) this.showing_json = this.json;
      if (!this.json[this.object_array_key]) return;

      const [start, end] = this.getStartAndEnd();
      const new_json = { ...this.json, [this.object_array_key]: [...this.json[this.object_array_key].slice(start, end)] }
      this.showing_json = new_json;
    },
    loadMoreArray() {
      const [start, end] = this.getStartAndEnd();
      this.showing_json = [...this.json.slice(start, end)];
    },
    checkScroll({ target }) {
      if (target.scrollTop === 0) {
        if (this.page <= 1) return;

        this.loadMore(true);
        target.scrollTop = target.scrollHeight - 10; 
      }

      if (target.scrollHeight - target.scrollTop === target.clientHeight) {
        if (!this.pageLimit || this.page >= this.pageLimit) return;

        this.loadMore();
      }
    },
  }
}
</script>

<template>
  <div>
    <div v-if="!json">
      <div class="column-container">
        <h1 class="mb-2" style="font-size: 48px;">JSON Tree Viewer</h1>
        <p class="mb-2" style="font-size: 24px;">Simple JSON Viewer that runs completely on-client. No data exchange</p>
        <div class="upload-wrapper">
          <button class="mb-2" style="padding: 5px;">Load JSON</button>
          <input type="file" @change="loadFile" />
        </div>
      </div>

      <div v-if="error">
        <p style="text-align: center; color: red;">Invalid JSON</p>
      </div>
    </div>

    <div v-else>
      <h1>{{ this.filename }}</h1>
      <div class="json-container" @scroll="checkScroll">
        <json-view 
          :show-array-index="false"
          :value="showing_json"
          :expand-depth="4"
        />
      </div>
      <p v-if="pageLimit">Current page: {{ page }} Total pages: {{ pageLimit }}</p>
    </div>
  </div>
</template>

<style>
.mb-2 {
  margin-bottom: 5px;
}

.upload-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
  cursor: pointer;
}

.upload-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.json-container {
  display: flex;
  width: 800px;
  height: 80vh;
  align-items: center;
  overflow: auto;
  margin: 5px;
  padding: 5px;
}

.json-container .jv-container {
  width: 100%;
  height: 100%;
}
</style>
