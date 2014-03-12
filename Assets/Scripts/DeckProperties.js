#pragma strict

var BackOfCard : Texture2D;
var Cards : Texture2D[];
var CardNo : int = 0;
var CardPrefab : GameObject;
var BoredManager : Bored;
var CardInstances : GameObject[];

private var CardHeight : float = 0.05;

function Start () {
	transform.renderer.material.SetTexture ("_MainTex", BackOfCard);
	transform.localScale.y = Cards.length * CardHeight;
}

function Update () {}

function TakeCard() {
	if (CardNo < Cards.length) {
 		CardInstances[CardNo] = Instantiate(CardPrefab, transform.position, transform.rotation);
		CardInstances[CardNo].transform.FindChild("cardfront").gameObject.renderer.material.SetTexture ("_MainTex", Cards[CardNo]);
		CardInstances[CardNo].transform.FindChild("cardback").gameObject.renderer.material.SetTexture ("_MainTex", BackOfCard);
		CardInstances[CardNo].transform.rotation.z = 180;
		BoredManager.PickUpCard(CardInstances[CardNo]);
		transform.localScale.y = (Cards.length - CardNo) * CardHeight;
   		CardNo++; 
	}

	if (CardNo == Cards.Length) {
		Destroy(transform.gameObject);
	}
}
