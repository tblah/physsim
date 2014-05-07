// GasParticle constructor. Inherits particle.

GasParticle = function(uid, x, y, z) {
	Particle.call(this, uid, x, y, z, 1, 0.02, 0xff33ff, 0.1);	// inherit from Particle, this gives me all of the properties
};

GasParticle.prototype = new Particle(); // inherit methods

GasParticle.prototype.takePosotive = function (n) {
	if (n >= 0)
		return n;
	else
		return -n;
}

GasParticle.prototype.tick = function ( gameContext ) { // overrides Particle.tick()
	this.mesh.position.x += this.velocity.x;
	this.mesh.position.y += this.velocity.y;
	this.mesh.position.z += this.velocity.z;
		
	this.checkWallCollisions( gameContext.bounds.min, gameContext.bounds.max );
	this.checkParticleCollisions();

	// change colour according to velocity: blue is fast, red is slow: aka blue is hotter, red is colder
	this.mesh.material.color.b = 6*(this.takePosotive(this.velocity.x) + this.takePosotive(this.velocity.y) + this.takePosotive(this.velocity.z));
	this.mesh.material.color.r = 1-10*(this.takePosotive(this.velocity.x) + this.takePosotive(this.velocity.y) + this.takePosotive(this.velocity.z));  
};