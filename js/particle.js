Particle = function(uid, x, y, z) { // class for particles
	this.radius = 0.02 ;
	this.colour = 0xff0000; // red
	this.Vmax = 0.1;
	this.mass = 1;
	this.id = uid;
	this.velocity = new THREE.Vector3((Math.random()*this.Vmax) - this.Vmax/2, (Math.random()*this.Vmax) - this.Vmax/2, (Math.random()*this.Vmax) - this.Vmax/2);
		
	this.geometry = new THREE.CubeGeometry(this.radius * 2, this.radius * 2, this.radius * 2); // cubes for performance
	this.material = new THREE.MeshBasicMaterial( {color: this.colour} );
	this.mesh = new THREE.Mesh(this.geometry, this.material);

	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.position.z = z;
};

Particle.prototype.tick = function() {	// does physics
	this.mesh.position.x += this.velocity.x;
	this.mesh.position.y += this.velocity.y;
	this.mesh.position.z += this.velocity.z;
		
	this.checkWallCollisions();
	this.checkParticleCollisions();
};

Particle.prototype.checkWallCollisions = function () {	// should make the edges of the container not hardcoded at some point
	// collisions with walls of the container
	if (this.mesh.position.x >= 2) { 	// collision with right wall
		this.velocity.x = -this.velocity.x;
		this.mesh.position.x -= this.radius;	// hacky teleport to stop a discrete error where particles end up outside the container
	} else if (this.mesh.position.x <= -2) { 	// collision with left wall
		this.velocity.x = -this.velocity.x;
		this.mesh.position.x += this.radius;
	}

	if (this.mesh.position.y >= 2) {	// collision with top wall
		this.velocity.y = -this.velocity.y;
		this.mesh.position.y -= this.radius;
	} else if (this.mesh.position.y <= -2) {	// collision with bottom wall
		this.velocity.y = -this.velocity.y;
		this.mesh.position.y += this.radius;
	}

	if (this.mesh.position.z >= 2) {	// collision with near wall
		this.velocity.z = -this.velocity.z;
		this.mesh.position.z -= this.radius;
	} else if (this.mesh.position.z <= -2) {	// collision with far wall
		this.velocity.z = -this.velocity.z;
		this.mesh.position.z += this.radius;
	}
};

Particle.prototype.collisionPythagoras = function(particle) {	// slow but easy to read
	var deltaX = this.mesh.position.x - this.mesh.position.x;
	var deltaY = this.mesh.position.y - this.mesh.position.y;
	var deltaZ = this.mesh.position.z - this.mesh.position.z;

	var distanceSquared = Math.pow(deltaX, 2)+Math.pow(deltaY,2)+Math.pow(deltaZ,2);
	var collisionDistanceSquared = Math.pow(this.radius + this.radius, 2);

	if (distanceSquared > collisionDistanceSquared)
		return false;
	else
		return true;
};

Particle.prototype.calcV1 = function(u1, u2, m1, m2) { // assumes an elastic collision
	return ((u1*(m1-m2) + 2*m2*u2)/(m1+m2));
};

Particle.prototype.checkParticleCollisions = function () {
	for (var i = 0; i < numParticles; i++) {
		if (particles[i].ID < this.id) { // avoid duplicate checks
			if (collisionPythagoras(particles[i])) {
				// we have a collision

				var u1 = new THREE.Vector3(velocity.x, velocity.y, velocity.z);	// so that we can use the old values in calculations for v2
				var v2 = new THREE.Vector3(particles[i].getVelocity().x, particles[i].getVelocity().y, particles[i].getVelocity().z);

				//var m2 = particles[i].getMass();

				/*velocity.x = calcV1(velocity.x, v2.x, mass, m2);
				v2.x = calcV1(v2.x, u1.x, mass, m2);

				velocity.y = calcV1(velocity.y, v2.y, mass, m2);
				v2.y = calcV1(v2.y, u1.y, mass, m2);

				velocity.z - calcV1(velocity.z, v2.z, mass, m2);
				v2.z = calcV1(v2.z, u1.z, mass, m2);*/

				this.velocity.x = v2.x;
				this.velocity.y = v2.y;
				this.velocity.z = v2.z;

				v2.x = u1.x;
				v2.y = u1.y;
				v2.z = u1.z;


				particles[i].velocity = v2;
			}
		}
			
	}
};