#pragma strict

var HoldingItem : boolean = false;
var HoldingObject : GameObject;
var CursorDecal : GameObject;
var spinX : int;
var spinY : int;
var spinZ : int;
var gamePiecePrefab : GameObject;
var gamePieceSpawn : Transform;
var normalTransform : Transform;
var instances : GameObject[];
var instance : int = 0;
var colours : Color[];
var coln : int = 0;

function Start () {
	if (normalTransform == null)
		throw "MissingFieldException - normalTransform";
		
	if (gamePieceSpawn == null)
		throw "MissingFieldException - gamePieceSpawn";
}

function FixedUpdate() {
    var hit : RaycastHit;
    var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	if (Physics.Raycast(ray, hit) && hit.transform.tag != 'gamepiece') {
			CursorDecal.transform.position.x = hit.point.x;	
			CursorDecal.transform.position.z = hit.point.z;	
	}
}

function Update () {
    var hit : RaycastHit;
    var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var gamePiece : GameObject;

	if (Input.GetKeyUp("g")) {
		instances[instance] = Instantiate(gamePiecePrefab, gamePieceSpawn.position, gamePieceSpawn.rotation);
		instances[instance].transform.FindChild('piece').renderer.material.SetColor ("_Color", colours[coln]);
		instance++;
		if (coln == 6) {
			coln = 0;
		} else {
			coln ++;
		}
	}

	if (!HoldingItem) {
	    if (Input.GetMouseButtonUp(0)) {
	        if (Physics.Raycast(ray, hit) && hit.transform.tag == 'card') {
				PickUpCard(hit.transform.gameObject);
	        }
	        if (Physics.Raycast(ray, hit) && (hit.transform.tag == 'gamepiece' || hit.transform.tag == 'dice')) {
				PickUpGamePiece(hit.transform.gameObject);
	        }
	    }
	} else {
		if (Input.GetMouseButtonUp(0)) {
			ReleaseObject();
			if (HoldingObject.transform.tag == 'dice') {
				spinX = Random.Range(-65, 65);
				spinY = Random.Range(-65, 65);
				spinZ = Random.Range(-65, 65);
				HoldingObject.rigidbody.angularVelocity = Vector3(spinX, spinY, spinZ);
				HoldingObject.rigidbody.velocity.y = 7;
			}
		}
	
		if (Physics.Raycast(ray, hit)) {
			HoldingObject.transform.position.x = hit.point.x;	
			HoldingObject.transform.position.z = hit.point.z;	
		}
		HoldingObject.transform.rotation = Quaternion.Slerp (HoldingObject.transform.rotation, normalTransform.rotation, Time.time * rotspeed);	
	    HoldingObject.transform.position.y = Mathf.MoveTowards(HoldingObject.transform.position.y, 2.1, Time.deltaTime * 5);
	}
	
}

private var rotspeed = 0.005;

function PickUpCard(item : GameObject) {
	if (!HoldingItem) {
		HoldingObject = item;
		HoldingObject.collider.enabled = false;
		HoldingObject.rigidbody.useGravity = false;
		HoldingItem = true;
	}
}

function PickUpGamePiece(item : GameObject) {
	if (!HoldingItem) {
		HoldingObject = item;
		HoldingObject.collider.enabled = false;
		HoldingObject.rigidbody.useGravity = false;
		HoldingItem = true;
	}
}

function ReleaseObject() {
	HoldingObject.collider.enabled = true;
	HoldingObject.rigidbody.useGravity = true;
	HoldingItem = false;
}