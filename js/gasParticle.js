// GasParticle constructor. Inherits particle.

GasParticle = function(uid, x, y, z) {
	Particle.call(this, uid, x, y, z, 1);	// inherit from Particle, this gives me all of the variables
};

GasParticle.prototype = new Particle(); // inherit methods

GasParticle.prototype.tick = function () { // overrides Particle.tick()
	this.mesh.position.x += this.velocity.x;
	this.mesh.position.y += this.velocity.y;
	this.mesh.position.z += this.velocity.z;
		
	this.checkWallCollisions();
	this.checkParticleCollisions();

	console.log("This is a gas particle");	// just for test purposes 
};


