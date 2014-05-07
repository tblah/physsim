Particle = function(uid, x, y, z, mass, radius, colour, Vmax) { // constructor for particles
	this.radius = radius;
	this.colour = colour;
	this.Vmax = Vmax;
	this.mass = mass;
	this.id = uid;
	this.velocity = new THREE.Vector3((Math.random()*this.Vmax) - this.Vmax/2, (Math.random()*this.Vmax) - this.Vmax/2, (Math.random()*this.Vmax) - this.Vmax/2);
		
	//this.geometry = new THREE.CubeGeometry(this.radius * 2, this.radius * 2, this.radius * 2); // cubes for performance
	this.geometry = new THREE.SphereGeometry(this.radius);
	this.material = new THREE.MeshBasicMaterial( {color: this.colour} );
	this.mesh = new THREE.Mesh(this.geometry, this.material);

	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.position.z = z;
};

Particle.prototype.tick = function( gameContext ) { // this is overwritten u fuck
	this.mesh.position.x += this.velocity.x;
	this.mesh.position.y += this.velocity.y;
	this.mesh.position.z += this.velocity.z;
		
	this.checkWallCollisions( gameContext.bounds.min, gameContext.bounds.max );
	this.checkParticleCollisions();
};

Particle.prototype.checkWallCollisions = function ( minVector, maxVector ) {
	// collisions with walls of the container
	if (this.mesh.position.x >= maxVector.x) { 	// collision with right wall
		this.velocity.x = -this.velocity.x;
		this.mesh.position.x -= this.radius;	// hacky teleport to stop a discrete error where particles end up outside the container
	} else if (this.mesh.position.x <= minVector.x) { 	// collision with left wall
		this.velocity.x = -this.velocity.x;
		this.mesh.position.x += this.radius;
	}

	if (this.mesh.position.y >= maxVector.y) {	// collision with top wall
		this.velocity.y = -this.velocity.y;
		this.mesh.position.y -= this.radius;
	} else if (this.mesh.position.y <= minVector.y) {	// collision with bottom wall
		this.velocity.y = -this.velocity.y;
		this.mesh.position.y += this.radius;
	}

	if (this.mesh.position.z >= maxVector.z) {	// collision with near wall
		this.velocity.z = -this.velocity.z;
		this.mesh.position.z -= this.radius;
	} else if (this.mesh.position.z <= minVector.z) {	// collision with far wall
		this.velocity.z = -this.velocity.z;
		this.mesh.position.z += this.radius;
	}
};

Particle.prototype.collisionPythagoras = function(particle) {	// slow but easy to read
	var distance = this.mesh.position.distanceTo(particle.mesh.position);
	var collisionDistance = this.radius * 2;

	return distance < collisionDistance;
};

Particle.prototype.calcV1 = function(u1, u2, m1, m2) { // assumes an elastic collision
	return ((u1*(m1-m2) + 2*m2*u2)/(m1+m2));
};

Particle.prototype.checkParticleCollisions = function () {
	for (var i = 0; i < numParticles; i++) {
		//if (particles[i].id < this.id) { // avoid duplicate checks
			if (this.collisionPythagoras(particles[i])) {
				// we have a collision

				var u1 = new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.z);	// so that we can use the old values in calculations for v2
				var v2 = new THREE.Vector3(particles[i].velocity.x, particles[i].velocity.y, particles[i].velocity.z);

				var m2 = particles[i].mass;

				this.velocity.x = this.calcV1(this.velocity.x, v2.x, this.mass, m2);
				v2.x = this.calcV1(v2.x, u1.x, this.mass, m2);

				this.velocity.y = this.calcV1(this.velocity.y, v2.y, this.mass, m2);
				v2.y = this.calcV1(v2.y, u1.y, this.mass, m2);

				this.velocity.z - this.calcV1(this.velocity.z, v2.z, this.mass, m2);
				v2.z = this.calcV1(v2.z, u1.z, this.mass, m2);

				particles[i].velocity = v2;
			}
		//}
			
	}
};