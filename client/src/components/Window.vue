<template>
	<transition name="fade" @after-leave="$emit('close')" @after-enter="$emit('open')">
		<div ref='window' class='window' :style='styleWindow' v-draggable='draggableValue' @mousedown='activate'>
			<v-card class='inner'>
				<v-system-bar window dark class='systemBar' :ref='handleRef'>
					{{ title }}
					<v-spacer />
					<v-icon>remove</v-icon>
					<v-icon class='systemBar__btn' @click='closeBtnClick'>close</v-icon>
				</v-system-bar>
				<slot />
			</v-card>
		</div>
	</transition>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Draggable, DraggableValue } from 'draggable-vue-directive';
import ZElement from '../ZElement';
import { windows } from '../windows';

const instances: Window[] = [];

@Component({
	directives: {
		Draggable,
	},
})
export default class Window extends Vue {
	public zElement!: ZElement;

	private draggableValue: DraggableValue = {};
	private handleRef: string = 'handleId';
	private zIndex: any = 'auto';
	private open: boolean = true;

	@Prop({ default: '' })
	private title!: string;

	@Prop()
	private pid!: number;

	@Prop()
	private width?: number;

	@Prop()
	private height?: number;

	public mounted() {
		this.draggableValue.handle = this.$refs[this.handleRef] as HTMLElement;
		this.draggableValue.boundingElement = this.$parent.$el as HTMLElement;

		this.$store.commit('apps/setWindowOpen', {
			pid: this.pid,
			open: true,
		});

		instances.push(this);
		this.zElement = new ZElement(0, (zIndex: any) => this.zIndex = `${zIndex}`);
		windows.add(this);
	}

	public beforeDestroy() {
		windows.delete(this);
		this.zElement.unregister();
		instances.splice(instances.indexOf(this), 1);
	}

	private activate() {
		this.$store.commit('apps/setActiveApp', this.pid);
		this.zElement.raise();
	}

	private get styleWindow() {
		return {
			width: this.width ? `${this.width}px` : '350px',
			height: this.height ? `${this.height}px` : '200px',
			zIndex: this.zIndex,
			display: this.isOpen ? 'default' : 'none',
		};
	}

	public get isOpen() {
		if (!this.pid) {
			return this.open;
		}
		return this.$store.state.apps.activeWindows[this.pid].windowSettings.open;
	}

	@Prop()
	public set isOpen(open) {
		if (!this.pid) {
			this.open = open;
			return;
		}
		// this.$store.commit('apps/removeWindow', this.pid);
	}

	private closeBtnClick() {
		this.isOpen = false;
	}
}
</script>

<style scoped lang='less'>
	.systemBar {
		user-select: none;
		
		&__btn {
			cursor: pointer;
		}
	}
	
	.window {
		position: absolute;
		
		& .inner {
			height: 100%;
		}
	}
</style>