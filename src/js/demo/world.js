
var World = function(container) {
    this.dice_mass = 400;
    this.dice_inertia = 10; 

    this.last_time = 0;
    this.running = false;


    this.w = (window.innerWidth - 1) / 2;
    this.h = (window.innerHeight - 1) / 2;
    this.aspect = Math.min(this.w / this.w, this.h / this.h);
    this.scale = Math.sqrt(this.w * this.w + this.h * this.h) / 13;
    this.use_adapvite_timestep = true;

    this.renderer = window.WebGLRenderingContext
        ? new THREE.WebGLRenderer({ antialias: true })
        : new THREE.CanvasRenderer({ antialias: true });
    this.renderer.setSize(this.w * 2, this.h * 2);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.setClearColor(0xffffff, 1);
    container.appendChild(this.renderer.domElement);

    this.d20 = null;
    
    this._setup_physics();
    this._setup_scene();
    this._setup_camera();   

    this.renderer.render(this.scene, this.camera);
}

World.prototype._setup_physics = function() {
    this.world = new CANNON.World();    
    this.world.gravity.set(0, 0, -9.8 * 800);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 8;


    this.dice_body_material = new CANNON.Material();
    var desk_body_material = new CANNON.Material();
    var barrier_body_material = new CANNON.Material();
    this.world.addContactMaterial(new CANNON.ContactMaterial(
                desk_body_material, this.dice_body_material, 0.01, 0.5));
    this.world.addContactMaterial(new CANNON.ContactMaterial(
                barrier_body_material, this.dice_body_material, 0, 1.0));
    this.world.addContactMaterial(new CANNON.ContactMaterial(
                this.dice_body_material, this.dice_body_material, 0, 0.5));

    this.world.add(new CANNON.RigidBody(0, new CANNON.Plane(), desk_body_material));

    var barrier;
    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    barrier.position.set(0, this.h * 0.93, 0);
    this.world.add(barrier);

    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    barrier.position.set(0, -this.h * 0.93, 0);
    this.world.add(barrier);

    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
    barrier.position.set(this.w * 0.93, 0, 0);
    this.world.add(barrier);

    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    barrier.position.set(-this.w * 0.93, 0, 0);
    this.world.add(barrier);

}

World.prototype._setup_camera = function() {
    var wh = Math.min(this.w, this.h) / Math.tan(10 * Math.PI / 180);
    this.camera = new THREE.PerspectiveCamera(20, this.w / this.h, 1, wh * 1.3);
    this.camera.position.z = wh;
}

World.prototype._setup_scene = function() {
    this.scene = new THREE.Scene();

    this.desk = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 2, this.h * 2, 1, 1), 
            new THREE.MeshLambertMaterial({ color: 0xffffff }));
    this.desk.receiveShadow = true;
    this.scene.add(this.desk);
    
    var ambientLight = new THREE.AmbientLight(0xf0f0f0);
    this.scene.add(ambientLight);

    var mw = Math.max(this.w, this.h);
    var light = new THREE.SpotLight(0xffffff);
    light.position.set(-mw / 2, mw / 2, mw * 2);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadowCameraNear = mw / 10;
    light.shadowCameraFar = mw * 3;
    light.shadowCameraFov = 50;
    light.shadowBias = 0.001;
    light.shadowDarkness = 0.3;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    this.scene.add(light);
}

World.prototype.spawn_d20 = function() {
    var state = this.generate_throw_state();

	var dice = dicemaker.create_d20(this.scale);
    dice.castShadow = true;
    dice.body = new CANNON.RigidBody(this.dice_mass, dice.geometry.cannon_shape, this.dice_body_material);
    dice.body.position.set(state.pos.x, state.pos.y, state.pos.z);
    dice.body.quaternion.setFromAxisAngle(new CANNON.Vec3(state.rot.x, state.rot.y, state.rot.z), state.rot.a * Math.PI * 2);
    dice.body.angularVelocity.set(state.angvel.x, state.angvel.y, state.angvel.z);
    dice.body.velocity.set(state.vel.x, state.vel.y, state.vel.z);
    dice.body.linearDamping = 0.1;
    dice.body.angularDamping = 0.1;
    this.scene.add(dice);
    this.d20 = dice;
    this.world.add(dice.body);
}

World.prototype.check = function() {
    var res = true;
    var e = 1;
    var time = (new Date()).getTime();
    if (time - this.running < 10000) {
        var dice = this.d20;
        if (!this.d20.stopped) {
	        var a = dice.body.angularVelocity, v = dice.body.velocity;
	        if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e &&
	                Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
	            if (this.d20.stopped) {
	                if (time - this.d20.stopped > 50) {
	                    this.d20.stopped = true;
	                }
	            }
	            else this.d20.stopped = (new Date()).getTime();
	            res = false;
	        }
	        else {
	            this.d20.stopped = undefined;
	            res = false;

	        }
    	}
    }

    if (res) {
        this.running = false;
        var intersects = (new THREE.Raycaster(
                    new THREE.Vector3(this.d20.position.x, this.d20.position.y, 200),
                    new THREE.Vector3(0, 0, -1))).intersectObjects([this.d20]);
        var matindex = intersects[0].face.materialIndex - 1;
        if (this.callback) this.callback.call(this, matindex);
    }
}

World.prototype.__animate = function(threadid) {
    var time = (new Date()).getTime();
    if (this.use_adapvite_timestep) {
        var time_diff = (time - this.last_time) / 1000;
        if (time_diff > 3) time_diff = 1 / 60;
        while (time_diff > 1.1 / 60) {
            this.world.step(1 / 60);
            time_diff -= 1 / 60;
        }
        this.world.step(time_diff);
    }
    else {
        this.world.step(1 / 60);
    }
    for (var i in this.scene.children) {
        var interact = this.scene.children[i];
        if (interact.body != undefined) {
            interact.body.position.copy(interact.position);
            interact.body.quaternion.copy(interact.quaternion);
        }
    }
    this.renderer.render(this.scene, this.camera);
    this.last_time = this.last_time ? time : (new Date()).getTime();
    if (this.running == threadid) this.check();
    if (this.running == threadid) {
        (function(t, tid) {
            requestAnimationFrame(function() { t.__animate(tid); });
        })(this, threadid);
    }
}

World.prototype.clear = function() {
    this.running = false;
    var dice;

    if (this.d20) {
    	this.scene.remove(this.d20);
    	this.world.remove(this.d20.body);
    }
    
    if (this.pane) this.scene.remove(this.pane);
    this.renderer.render(this.scene, this.camera);
}

World.prototype.generate_throw_state = function() {
    var vel_unit = rnd_xy_rotation({x: 1, y: 0});
    var boost = (rnd() * 4 ) + this.w + this.h;
    var vel = { x: vel_unit.x * boost, y: vel_unit.y * boost, z: -10 };

    var pos = {
        x: -this.w, //this.w * (vel_unit.x > 0 ? -1 : 1) * 0.9,
        y: 0 + rnd() * 200,
        z: rnd() * 200 + 300
    };
    
    var inertia = this.dice_inertia;

    var angvel = {
        x: -(rnd() * 5 + inertia) * vel_unit.y,
        y:  (rnd() * 5 + inertia) * vel_unit.x,
        z: 0
    };

    var rot = { x: rnd(), y: rnd(), z: rnd(), a: rnd() };

    return { pos: pos, vel: vel, angvel: angvel, rot: rot };
}

World.prototype.throw = function(after_roll) {
    var box = this;
    if (box.rolling) return;

    box.clear();
	box.rolling = true;
    this.spawn_d20();
    this.callback = function(result) {
        after_roll.call(box, result);
        box.rolling = false;
    };
    this.running = (new Date()).getTime();
    this.last_time = 0;
    this.__animate(this.running);
}