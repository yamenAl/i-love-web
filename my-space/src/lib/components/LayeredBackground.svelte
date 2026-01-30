<script>
	import backgroundLight from '$lib/assets/images/light-background/background-light.png';
	import cloud from '$lib/assets/images/light-background/cloud.png';
	import sunShadow from '$lib/assets/images/light-background/sun-shadow.png';
	import sunImg from '$lib/assets/images/light-background/sun.png';
	import mountainFar from '$lib/assets/images/light-background/mountain-far.png';
	import mountainFarLeft from '$lib/assets/images/light-background/mountain-far-left.png';
	import mountainShadow from '$lib/assets/images/light-background/mountain-shadow.png';
	import mountainMainBig from '$lib/assets/images/light-background/mountain-main-big.png';
	import mountainLayer2 from '$lib/assets/images/light-background/mountain-layer-2.png';
	import ground2 from '$lib/assets/images/light-background/ground-2.png';
	import ground3 from '$lib/assets/images/light-background/ground-3.png';
	import ground4 from '$lib/assets/images/light-background/ground-4.png';
	import ground5 from '$lib/assets/images/light-background/ground-5.png';
</script>

<div class="view">
	<!-- Background: Figma position 9764, -4105 | 1536 x 1024 -->
	<div class="layer layer--bg" style="background-image: url({backgroundLight})"></div>

	<!-- Cloud: own layer – set position in CSS -->
	<div class="layer layer--cloud" style="background-image: url({cloud})"></div>

	<!-- Sun shadow: own layer – set position in CSS -->
	<div class="layer layer--sun-shadow" style="background-image: url({sunShadow})"></div>

	<!-- Sun -->
	<div class="layer layer--sun" style="background-image: url({sunImg})"></div>

	<!-- Mountain far: behind mountain-far-left -->
	<div class="layer layer--mountain-far" style="background-image: url({mountainFar})"></div>

	<!-- Mountain shadow -->
	<div class="layer layer--mountain-shadow" style="background-image: url({mountainShadow})"></div>

	<!-- Mountain main big -->
	<div class="layer layer--mountain-main-big" style="background-image: url({mountainMainBig})"></div>

	<!-- Mountain far left: on top of everything – set position in CSS -->
	<div class="layer layer--mountain-far-left" style="background-image: url({mountainFarLeft})"></div>

	<!-- Mountain layer 2: before ground-5 -->
	<div class="layer layer--mountain-layer-2" style="background-image: url({mountainLayer2})"></div>

	<!-- Ground 2 -->
	<div class="layer layer--ground-2" style="background-image: url({ground2})"></div>

	<!-- Ground 3 -->
	<div class="layer layer--ground-3" style="background-image: url({ground3})"></div>

	<!-- Ground 4 -->
	<div class="layer layer--ground-4" style="background-image: url({ground4})"></div>

	<!-- Ground 5 -->
	<div class="layer layer--ground-5" style="background-image: url({ground5})"></div>
</div>

<style>
	.view {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		background-color: transparent;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.layer {
		position: absolute;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-color: transparent;
	}

	.layer--bg {
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/* cloud: on top of sun – use z-index (letter z, not x) */
	.layer--cloud {
		width: 936px;
		height: 524px;
		right: 10%;
		top: -15%;
		background-size: cover;
		mix-blend-mode: lighten;
		z-index: 10;
	}

	/* sun-shadow: behind sun */
	.layer--sun-shadow {
		width: 550px;
		height: 300px;
		left: 20%;
		top: 1%;
		transform: translateX(-50%);
		background-size: contain;
		z-index: 1;
	}

	/* sun: above sun-shadow, below cloud */
	.layer--sun {
		width: 550px;
		height: 300px;
		left: 80%;
		top: 1%;
		transform: translateX(-50%);
		background-size: contain;
		z-index: 2;
	}

	/* mountain-far: behind mountain-far-left */
	.layer--mountain-far {
		width: 1536px;
		height: 1024px;
		left: 0;
		top: -10%;
		background-size: cover;
		z-index: 15;
	}

	/* mountain-shadow: on top of mountain-far, below mountain-far-left */
	.layer--mountain-shadow {
		width: 1536px;
		height: 1124px;
		left: 0;
		top: -20%;
		background-size: cover;
		z-index: 40;
	}

	/* mountain-main-big */
	.layer--mountain-main-big {
		width: 1536px;
		height: 700px;
		left: 0;
		top: 1%;
		background-size: cover;
		z-index: 58;
	}

	/* mountain-far-left: on top of everything (Figma 1536 x 1024) */
	.layer--mountain-far-left {
		width: 1536px;
		height: 1024px;
		left: 0;
		top:-25%;
		background-size: cover;
		z-index: 20;
	}

	/* mountain-layer-2: before ground-5 */
	.layer--mountain-layer-2 {
		width: 1536px;
		height: 1224px;
		right:  0;
		bottom: -40%;
		background-size: cover;
		background-position: bottom;
		z-index: 59;
	}

	/* ground-2: before ground-3 */
	.layer--ground-2 {
		width: 100%;
		min-height: 70vh;
		left: 0;
		bottom: -40%;
		background-size: cover;
		background-position: bottom;
		z-index: 66;
	}

	/* ground-3: before ground-4 */
	.layer--ground-3 {
		width: 200vh;
		height: 100vh;
		left: 0;
		bottom: -35%;
		background-size: cover;
		background-position: bottom;
		z-index: 63;
	}

	/* ground-4: before ground-5 */
	.layer--ground-4 {
		width: 1536px;
		height: 724px;
		left: 0;
		bottom: -35%;
		background-size: cover;
		background-position: bottom;
		z-index: 62;
	}

	/* ground-5: foreground at bottom */
	.layer--ground-5 {
		width: 1536px;
		height: 824px;
		left: 0;
		bottom: -30%;
		background-size: cover;
		background-position: bottom;
		z-index: 60;
	}
</style>
