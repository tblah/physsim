function Particle(uid, x, y, z) { // class for particles
	var radius = 0.02 ;
	var colour = 0xff0000; // red
	var Vmax = 0.1;
	var mass = 1;
	var id = uid;
		
	//var geometry = new THREE.CubeGeometry(radius, radius, radius);
	var geometry = new THREE.SphereGeometry(radius);
	var material = new THREE.MeshBasicMaterial( {color: colour} );
	var mesh = new THREE.Mesh(geometry, material);

	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = z;

	var genVelocity = function () {
		return (Math.random()*Vmax) - Vmax/2;
	}

	var velocity = new THREE.Vector3(genVelocity(), genVelocity(), genVelocity());

	this.tick = function() {	// does physics
		mesh.position.x += velocity.x;
		mesh.position.y += velocity.y;
		mesh.position.z += velocity.z;
		
		checkWallCollisions();
		checkParticleCollisions();
	}

	var checkWallCollisions = function () {	// should make the edges of the container not hardcoded at some point
		// collisions with walls of the container
		if (mesh.position.x >= 2) { 	// collision with right wall
			velocity.x = -velocity.x;
			mesh.position.x -= radius;	// hacky teleport to stop a discrete error where particles end up outside the container
		} else if (mesh.position.x <= -2) { 	// collision with left wall
			velocity.x = -velocity.x;
			mesh.position.x += radius;
		}

		if (mesh.position.y >= 2) {	// collision with top wall
			velocity.y = -velocity.y;
			mesh.position.y -= radius;
		} else if (mesh.position.y <= -2) {	// collision with bottom wall
			velocity.y = -velocity.y;
			mesh.position.y += radius;
		}

		if (mesh.position.z >= 2) {	// collision with near wall
			velocity.z = -velocity.z;
			mesh.position.z -= radius;
		} else if (mesh.position.z <= -2) {	// collision with far wall
			velocity.z = -velocity.z;
			mesh.position.z += radius;
		}
	}

	var collisionPythagoras = function(particle) {	// slow but easy to read
		var deltaX = mesh.position.x - particle.getMesh().position.x;
		var deltaY = mesh.position.y - particle.getMesh().position.y;
		var deltaZ = mesh.position.z - particle.getMesh().position.z;

		var distanceSquared = Math.pow(deltaX, 2)+Math.pow(deltaY,2)+Math.pow(deltaZ,2);
		var collisionDistanceSquared = Math.pow(radius + particle.getRadius(), 2);

		if (distanceSquared > collisionDistanceSquared)
			return false;
		else
			return true;
	}

	var calcV1 = function(u1, u2, m1, m2) { // assumes an elastic collision
		return ((u1*(m1-m2) + 2*m2*u2)/(m1+m2));
	}

	var checkParticleCollisions = function () {
		for (var i = 0; i < numParticles; i++) {
			if (particles[i].getID() < id) { // avoid duplicate checks
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

					velocity.x = v2.x;
					velocity.y = v2.y;
					velocity.z = v2.z;

					v2.x = u1.x;
					v2.y = u1.y;
					v2.z = u1.z;


					particles[i].setVelocity(v2);
				}
			}
		}
	}

	this.getMesh = function() {
		return mesh;
	}

	this.getID = function () {
		return id;
	}

	this.getRadius = function() {
		return radius;
	}

	this.getMass = function() {
		return mass;
	}

	this.setVelocity = function(v) {
		velocity = v;
	} 

	this.getVelocity = function() {
		return velocity;
	}
}